require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const quizRoutes = require('./routes/quizRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const Quiz = require('./models/Quiz');
const app = express();

// Enable dotenv configuration
require('dotenv').config();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Enable trust proxy
app.set('trust proxy', true);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/quiz', quizRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const newPort = 4000; // Change to an available port
app.listen(newPort, () => console.log(`Server running on port ${newPort}`));
