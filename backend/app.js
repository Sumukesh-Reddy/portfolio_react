const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://sumukeshmopuram1:q47rfTFHMkmrHy16@messages.2nguodb.mongodb.net/?retryWrites=true&w=majority&appName=Messages")
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Model
const Message = require('./models/message');

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  console.log('Received POST /api/contact:', req.body);
  try {
    if (!req.body.name || !req.body.email || !req.body.message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const { name, email, message } = req.body;
    const newMessage = await Message.create({ name, email, message });
    
    res.status(201).json({ 
      success: true,
      message: 'Message saved successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Submission Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});