const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/submit_feedback', (req, res) => {
    const { name, email, message } = req.body;
    
    // Here you can process the feedback data as per your requirements
    // For now, just log it
    console.log('Received feedback:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    
    res.status(200).json({ message: 'Feedback received successfully!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
