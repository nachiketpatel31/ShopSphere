require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const http = require('http');
const assert = require('assert');
const mongoose = require('mongoose');
const app = require('../app');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Minimal test runner helper
const makeRequest = (server, options, postData = null) => {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqOptions = {
      hostname: '127.0.0.1',
      port,
      path: options.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Anti-CSRF header
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json;
        try {
          json = JSON.parse(data);
        } catch {
          json = data;
        }

        // Capture cookies
        const setCookie = res.headers['set-cookie'];
        let cookieToken = null;
        if (setCookie) {
          const match = setCookie.join(';').match(/token=([^;]+)/);
          if (match) cookieToken = match[1];
        }

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          cookieToken,
          body: json
        });
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('\n======================================================');
  console.log('       ShopSphere Automated API Test Suite');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      process.stdout.write(`• Testing: ${name}... `);
      await fn();
      console.log('✓ PASSED');
      passed++;
    } catch (err) {
      console.log('✗ FAILED');
      console.error(`  Error: ${err.message}`);
      failed++;
    }
  };

  await connectDB();

  // Start test HTTP server on random ephemeral port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  const testEmail = `test_user_${Date.now()}@shopsphere.test`;
  const adminEmail = `test_admin_${Date.now()}@shopsphere.test`;
  let userCookie = null;
  let userToken = null;
  let adminCookie = null;
  let testProduct = null;

  try {
    // 1. Health check
    await test('GET /api/health returns healthy and database connected', async () => {
      const res = await makeRequest(server, { path: '/api/health', method: 'GET' });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.database.connected, true);
    });

    // 2. User registration
    await test('POST /api/auth/register registers user and returns sanitized profile', async () => {
      const res = await makeRequest(
        server,
        { path: '/api/auth/register', method: 'POST' },
        {
          name: 'Test Customer',
          email: testEmail,
          password: 'Password@123',
          confirmPassword: 'Password@123',
          phone: '+91 9876543210'
        }
      );

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.user.email, testEmail);
      assert.strictEqual(res.body.user.role, 'user');
      assert.strictEqual(res.body.user.passwordHash, undefined, 'Never expose passwordHash');
      assert.ok(res.cookieToken || res.body.token, 'Token must be issued');
      userCookie = `token=${res.cookieToken || res.body.token}`;
      userToken = res.body.token;
    });

    // 3. Duplicate registration rejection
    await test('POST /api/auth/register rejects duplicate email address', async () => {
      const res = await makeRequest(
        server,
        { path: '/api/auth/register', method: 'POST' },
        {
          name: 'Another User',
          email: testEmail,
          password: 'Password@123'
        }
      );
      assert.strictEqual(res.statusCode, 409);
      assert.strictEqual(res.body.success, false);
    });

    // 4. Login
    await test('POST /api/auth/login authenticates with valid credentials', async () => {
      const res = await makeRequest(
        server,
        { path: '/api/auth/login', method: 'POST' },
        { email: testEmail, password: 'Password@123' }
      );
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.cookieToken || res.body.token);
    });

    // 5. Protected route /api/auth/me
    await test('GET /api/auth/me returns authenticated user session', async () => {
      const res = await makeRequest(server, {
        path: '/api/auth/me',
        method: 'GET',
        headers: { Cookie: userCookie, Authorization: `Bearer ${userToken}` }
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.user.email, testEmail);
    });

    // 6. Ensure sample test product exists for subsequent tests
    testProduct = await Product.findOne({ sku: 'SSP-ELEC-001' });
    if (!testProduct) {
      testProduct = await Product.create({
        sku: 'SSP-TEST-001',
        name: 'Test Audiophile Headphone',
        description: 'Test product description',
        category: 'Electronics',
        price: 9999,
        stock: 5,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900']
      });
    }

    // 7. Product Catalog listing
    await test('GET /api/products returns product catalog with pagination', async () => {
      const res = await makeRequest(server, { path: '/api/products?limit=5', method: 'GET' });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.products));
      assert.ok(res.body.total >= 1);
    });

    // 8. Category filter
    await test('GET /api/products?category=Electronics filters by category', async () => {
      const res = await makeRequest(server, { path: '/api/products?category=Electronics', method: 'GET' });
      assert.strictEqual(res.statusCode, 200);
      for (const prod of res.body.products) {
        assert.strictEqual(prod.category, 'Electronics');
      }
    });

    // 9. Single product lookup
    await test('GET /api/products/:id retrieves single product details', async () => {
      const res = await makeRequest(server, { path: `/api/products/${testProduct._id}`, method: 'GET' });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.product._id, testProduct._id.toString());
      assert.ok(Array.isArray(res.body.relatedProducts));
    });

    // 10. Non-existent product
    await test('GET /api/products/:id returns 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await makeRequest(server, { path: `/api/products/${fakeId}`, method: 'GET' });
      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.body.success, false);
    });

    // 11. Role authorization: Regular user blocked from admin endpoints
    await test('GET /api/admin/dashboard blocks regular user with 403 Forbidden', async () => {
      const res = await makeRequest(server, {
        path: '/api/admin/dashboard',
        method: 'GET',
        headers: { Cookie: userCookie, Authorization: `Bearer ${userToken}` }
      });
      assert.strictEqual(res.statusCode, 403);
      assert.strictEqual(res.body.success, false);
    });

    // 12. Create test admin and verify admin dashboard access
    const adminPassHash = await User.hashPassword('Admin@123456');
    const adminUser = await User.create({
      name: 'System Admin',
      email: adminEmail,
      passwordHash: adminPassHash,
      role: 'admin'
    });

    const adminLoginRes = await makeRequest(
      server,
      { path: '/api/auth/login', method: 'POST' },
      { email: adminEmail, password: 'Admin@123456' }
    );
    adminCookie = `token=${adminLoginRes.cookieToken || adminLoginRes.body.token}`;
    const adminToken = adminLoginRes.body.token;

    await test('GET /api/admin/dashboard allows Admin user with 200 OK and metrics', async () => {
      const res = await makeRequest(server, {
        path: '/api/admin/dashboard',
        method: 'GET',
        headers: { Cookie: adminCookie, Authorization: `Bearer ${adminToken}` }
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(typeof res.body.stats.productCount === 'number');
      assert.ok(typeof res.body.stats.totalRevenue === 'number');
    });

    // 13. Checkout Failure Scenario: Exceeding stock
    await test('POST /api/orders rejects order exceeding stock with 400 and zero deduction', async () => {
      const currentStock = testProduct.stock;
      const res = await makeRequest(
        server,
        {
          path: '/api/orders',
          method: 'POST',
          headers: { Cookie: userCookie, Authorization: `Bearer ${userToken}` }
        },
        {
          shippingAddress: {
            fullName: 'Test Customer',
            phone: '+91 9876543210',
            street: '123 Test Lane',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560001',
            country: 'India'
          },
          paymentMethod: 'COD',
          items: [{ product: testProduct._id.toString(), quantity: currentStock + 50 }]
        }
      );

      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.body.success, false);

      // Verify product stock in DB was NOT changed
      const unchangedProduct = await Product.findById(testProduct._id);
      assert.strictEqual(unchangedProduct.stock, currentStock, 'Stock must not be decremented on failure');
    });

    // 14. Successful Checkout Scenario with atomic stock decrement
    await test('POST /api/orders places valid order and safely decrements stock', async () => {
      const beforeStock = testProduct.stock;
      const qtyToOrder = 1;

      const res = await makeRequest(
        server,
        {
          path: '/api/orders',
          method: 'POST',
          headers: { Cookie: userCookie, Authorization: `Bearer ${userToken}` }
        },
        {
          shippingAddress: {
            fullName: 'Test Customer',
            phone: '+91 9876543210',
            street: '123 Test Lane',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560001',
            country: 'India'
          },
          paymentMethod: 'COD',
          items: [{ product: testProduct._id.toString(), quantity: qtyToOrder }]
        }
      );

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.order.orderNumber);
      assert.strictEqual(res.body.order.orderStatus, 'Placed');

      // Verify stock was decremented by exactly qtyToOrder
      const afterProduct = await Product.findById(testProduct._id);
      assert.strictEqual(afterProduct.stock, beforeStock - qtyToOrder);
    });

    // Cleanup test artifacts
    await User.deleteMany({ email: { $in: [testEmail, adminEmail] } });
    if (testProduct.sku === 'SSP-TEST-001') {
      await Product.findByIdAndDelete(testProduct._id);
    }
  } finally {
    server.close();
  }

  console.log('\n======================================================');
  console.log(`  Test Suite Completed: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
