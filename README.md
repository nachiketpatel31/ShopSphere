# ShopSphere — Full-Stack E-Commerce Web Application

ShopSphere is a full-stack e-commerce application developed for the **Full Stack Developer Internship technical assignment at Rewamp Digital**.

It combines a premium editorial-inspired storefront with product discovery, shopping cart and wishlist management, secure authentication, Cash on Delivery (COD) checkout, order tracking, and an administrative dashboard.

The application uses the MERN stack: MongoDB, Express.js, React, and Node.js.

## 1. Features

### Storefront
- Responsive, editorial-inspired user interface.
- Product catalog with search, filtering, sorting, and pagination.
- Product details with image galleries, specifications, stock availability, and related products.
- Category-based product browsing.

### Shopping and Orders
- User-specific cart and wishlist.
- Server-side product price and order total validation.
- Shipping address validation and saved address support.
- Cash on Delivery checkout.
- Order confirmation, order history, and status tracking.
- Inventory updates during order placement and cancellation.

### Authentication and Security
- User registration, login, and logout.
- JWT-based authentication using HTTP-only cookies.
- Password hashing with bcrypt.
- Protected routes and role-based authorization.
- Rate limiting on authentication endpoints.
- Server-side validation of sensitive operations.

### Admin Dashboard
- Overview of store statistics and orders.
- Product creation, editing, and deletion.
- Inventory and order status management.
- Customer account listing.
- Restricted access for authorized administrators.

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite 5, React Router 6 |
| Styling | Tailwind CSS 3 |
| UI utilities | Lucide React, React Hot Toast |
| API communication | Axios |
| Backend | Node.js, Express.js 4 |
| Database | MongoDB, Mongoose 8 |
| Authentication | JWT, bcryptjs, cookie-parser |
| Security and utilities | CORS, express-rate-limit, Morgan, dotenv |

## 3. Project Structure

```text
ShopSphere/
├── client/                 # React frontend
├── server/                 # Express backend
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication and authorization
│   ├── scripts/            # Database and admin utilities
│   ├── server.js           # Backend entry point
│   └── .env.example        # Backend environment template
├── .env.example            # Root environment template
├── package.json            # Root scripts
└── README.md
```

The exact files and directories may vary slightly with the current implementation.

## 4. Prerequisites

Install the following before running the application:

- **Node.js:** Version 18 or newer.
- **npm:** Included with Node.js.
- **MongoDB:** A local MongoDB Community Server installation or a MongoDB Atlas database.
- **Git:** Required to clone the repository.

Check your Node.js and npm versions:

```powershell
node --version
npm --version
```

Make sure your MongoDB server is running before starting the backend.

## 5. Clone the Repository

Open PowerShell or the VS Code terminal and run:

```powershell
git clone https://github.com/nachiketpatel31/ShopSphere.git
cd ShopSphere
```

Replace the placeholders with your actual GitHub repository URL and repository folder name.

## 6. Install Dependencies

From the project root, run:

```powershell
npm run install:all
```

If this script is unavailable, install the dependencies separately:

```powershell
npm install

cd server
npm install
cd ..

cd client
npm install
cd ..
```

## 7. Configure Environment Variables

Create local environment files from the provided example templates. Run these commands from the project root if the corresponding templates exist:

```powershell
Copy-Item .env.example .env
Copy-Item server\.env.example server\.env
```

If either local environment file already exists, keep it and update its values instead of overwriting it.

Configure the backend variables in `server/.env`. A typical local development configuration is:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/shopsphere
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
COOKIE_SECRET=replace_with_another_random_secret
```

**Important:**
- Use the variable names expected by the application's environment configuration.
- Replace the example secrets with your own strong random values.
- Never commit `.env` files or real credentials to GitHub.
- If using MongoDB Atlas, replace `MONGODB_URI` with your database connection string.
- Configure any additional variables required by the provided `.env.example` files.

## 8. Start MongoDB

For a local MongoDB installation, ensure that the MongoDB Windows service is running.

Check its status in PowerShell:

```powershell
Get-Service -Name "*Mongo*"
```

If the service exists but is stopped, open PowerShell with the necessary permissions and run:

```powershell
Start-Service -Name "MongoDB"
```

The service name can differ between installations.

Alternatively, use a configured MongoDB Atlas database and its connection string.

## 9. Seed the Database

To populate the database with the sample product catalog, run this command from the project root:

```powershell
npm run seed
```

The seed script is intended to populate or update sample product records without deliberately deleting customer accounts and order history.

Check the current seed script before rerunning it against a database containing important data.

**Warning:** Do not run any database reset command against data you need to preserve. A reset operation may delete records.

## 10. Run the Application

### Option A: Start both services together

From the project root, run:

```powershell
npm run dev
```

If configured in the root `package.json`, this starts both services:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Option B: Start services separately

**Terminal 1 — Backend**

```powershell
cd server
npm run dev
```

**Terminal 2 — Frontend**

```powershell
cd client
npm run dev
```

Open the storefront at:

http://localhost:5173

If port `5000` or `5173` is already in use, check whether the corresponding service is already running before starting another instance.

## 11. Create an Administrator Account

Register a normal user account through the storefront first if you want to promote an existing account.

From the project root, use the admin command supported by the current project scripts.

To promote an existing user, the documented command is:

```powershell
npm run admin:promote -- user@example.com
```

Replace `user@example.com` with the exact email address of your registered account.

If the project provides an interactive admin creation script, it may also support:

```powershell
npm run admin:create
```

Use only the command actually defined in the current root `package.json`. After promotion, log out and log back in, then visit:

http://localhost:5173/admin

Administrator access should be restricted to accounts with the appropriate server-side role.

## 12. Run Automated Tests

From the project root, run:

```powershell
npm run test:server
```

The available server tests cover important API behaviors, including health checks, authentication, product retrieval, authorization, and order or inventory validation.

Test coverage depends on the current test suite; this command does not replace manual testing of every storefront feature.

## 13. API Overview

The backend exposes REST API endpoints for the following resources. Exact routes and supported methods should be checked against the current server implementation.

| Resource | Example endpoints | Purpose |
|---|---|---|
| Health | `GET /api/health` | Check backend and database status |
| Authentication | `/api/auth` | Registration, login, logout, and profile |
| Products | `/api/products` | Catalog, product details, and administration |
| Cart | `/api/cart` | Manage cart items |
| Wishlist | `/api/wishlist` | Manage saved products |
| Orders | `/api/orders` | Place orders and retrieve order history |
| Admin | `/api/admin` | Dashboard statistics and customer management |

Protected endpoints require authentication. Administrative operations require the appropriate role.

## 14. Example User Workflow

1. Open the storefront and browse the product catalog.
2. Search for products or filter by category and price.
3. Open a product to inspect its details and availability.
4. Add products to the cart or wishlist.
5. Sign in or register an account.
6. Proceed to checkout and enter a valid shipping address.
7. Place a Cash on Delivery order.
8. View the confirmation page and order history.
9. Sign in with an administrator account to manage products and order statuses.

## 15. Important Implementation Notes

- **Pricing:** The backend should calculate order totals using authoritative product records rather than trusting prices supplied by the client.
- **Inventory:** Order placement and cancellation must maintain consistent stock quantities. MongoDB transactions require a replica set or a compatible sharded deployment; standalone MongoDB requires a different consistency strategy.
- **Authentication:** HTTP-only cookies help protect tokens from direct JavaScript access but do not, by themselves, prevent every authentication or cross-site request attack.
- **Payments:** The current checkout workflow uses Cash on Delivery rather than a third-party online payment gateway.
- **Environment security:** Real credentials, database passwords, and production secrets must remain outside the public repository.

## 16. Troubleshooting

**MongoDB connection error**
- Confirm that MongoDB is running.
- Check `MONGODB_URI` in `server/.env`.
- Verify that the database host and port are correct.

**Port already in use**
- Check whether the backend or frontend is already running.
- Stop only the duplicate process, or configure an available port.

**Admin page returns an authorization error**
- Confirm that your account has the administrator role.
- Log out and log back in after the role is changed.
- Check the backend logs for authorization errors.

**Dependencies or scripts are missing**
- Run `npm install` in the relevant project directory.
- Check the root, client, and server `package.json` files for the supported scripts.

---

**Developed for:** Rewamp Digital — Full Stack Developer Internship Technical Assignment

**Project:** ShopSphere — Premium Full-Stack E-Commerce Web Application

**Repository:** [https://github.com/nachiketpatel31/ShopSphere](https://github.com/nachiketpatel31/ShopSphere)

