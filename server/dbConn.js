const mongoose = require('mongoose');
require('dotenv').config();

// Connection configuration with timeout settings
const mongooseOptions = {
    serverSelectionTimeoutMS: 30000, // 30 seconds for server selection
    socketTimeoutMS: 45000,        // 45 seconds for socket timeout
    maxPoolSize: 10,               // Maximum number of sockets in the connection pool
    retryWrites: true,             // Retry write operations on transient errors
    retryReads: true,              // Retry read operations on transient errors
    connectTimeoutMS: 30000,       // 30 seconds for initial connection
    heartbeatFrequencyMS: 10000    // Send a heartbeat every 10 seconds
};

// Connection event handlers
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

// Reconnect on failure
const connectWithRetry = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI, mongooseOptions);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

// Initial connection
connectWithRetry();

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});

module.exports = mongoose;