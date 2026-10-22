require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const readline = require('readline');
const { connectDB } = require('../config/db');
const Product = require('../models/Product');

const resetAndSeed = async () => {
  try {
    console.log('========================================================');
    console.log('  WARNING: EXPLICIT DATABASE PRODUCT RESET');
    console.log('  This command will delete all current products and reload defaults.');
    console.log('========================================================');

    await connectDB();
    const deleted = await Product.deleteMany({});
    console.log(`[Reset] Cleared ${deleted.deletedCount} products.`);

    console.log('[Reset] Now triggering idempotent seed...');
    require('./seed');
  } catch (error) {
    console.error('[Reset Error]:', error.message);
    process.exit(1);
  }
};

resetAndSeed();
