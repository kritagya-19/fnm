const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const financeRoutes = require('./routes/finance');
const clientRoutes = require('./routes/clients');
const projectRoutes = require('./routes/projects');
const targetRoutes = require('./routes/targets');
const documentRoutes = require('./routes/documents');
const dashboardRoutes = require('./routes/dashboard');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/targets', targetRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// MongoDB Connection
// Use in-memory MongoDB for development if no MONGODB_URI is provided
async function connectDB() {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    // If no external MongoDB URI is provided, use in-memory MongoDB
    if (!mongoUri || mongoUri.includes('localhost:27017')) {
      console.log('📦 Starting in-memory MongoDB server...');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log(`📦 In-memory MongoDB started at ${mongoUri}`);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
}

// Start server
const PORT = process.env.PORT || 5000;

// Connect to DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

