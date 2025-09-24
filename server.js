const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Disable caching for development
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

// Serve static files from current directory
app.use(express.static('.', {
  index: 'index.html'
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log('Static files are being served...');
});