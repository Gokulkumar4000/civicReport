const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Disable caching for development
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

// Middleware to replace Firebase config placeholders
app.use((req, res, next) => {
  const filePath = path.join(__dirname, req.url);
  
  // Check if it's the firebase-config.js file
  if (req.url === '/firebase-config.js' && fs.existsSync(filePath)) {
    // Check if all required Firebase environment variables are present
    const requiredVars = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_APP_ID'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('Missing Firebase environment variables:', missingVars);
      res.status(500).send(`console.error('Missing Firebase environment variables: ${missingVars.join(', ')}');`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace placeholders with environment variables
    content = content.replace(/\{\{FIREBASE_API_KEY\}\}/g, process.env.VITE_FIREBASE_API_KEY);
    content = content.replace(/\{\{FIREBASE_AUTH_DOMAIN\}\}/g, `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`);
    content = content.replace(/\{\{FIREBASE_PROJECT_ID\}\}/g, process.env.VITE_FIREBASE_PROJECT_ID);
    content = content.replace(/\{\{FIREBASE_STORAGE_BUCKET\}\}/g, `${process.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`);
    content = content.replace(/\{\{FIREBASE_MESSAGING_SENDER_ID\}\}/g, process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '');
    content = content.replace(/\{\{FIREBASE_APP_ID\}\}/g, process.env.VITE_FIREBASE_APP_ID);
    
    res.setHeader('Content-Type', 'application/javascript');
    res.send(content);
    return;
  }
  
  next();
});

// Serve static files from current directory
app.use(express.static('.', {
  index: 'index.html'
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log('Static files are being served...');
  console.log('Firebase configuration loaded');
});