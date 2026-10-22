const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected. Attempting reconnection...');
      isConnected = false;
    });

    return conn.connection;
  } catch (error) {
    console.error(`[MongoDB] Initial connection error: ${error.message}`);
    throw error;
  }
};

const isReplicaSet = () => {
  try {
    return Boolean(
      mongoose.connection &&
      mongoose.connection.client &&
      mongoose.connection.client.topology &&
      mongoose.connection.client.topology.description &&
      mongoose.connection.client.topology.description.type &&
      mongoose.connection.client.topology.description.type.includes('ReplicaSet')
    );
  } catch {
    return false;
  }
};

module.exports = { connectDB, isReplicaSet };
