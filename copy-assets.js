#!/usr/bin/env node

// Simple script to copy necessary files to the dist directory
const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
  console.log('Created dist directory');
}

// Create .nojekyll file
fs.writeFileSync(path.join(__dirname, 'dist', '.nojekyll'), '');
console.log('Created .nojekyll file');

// Copy logo to dist root
try {
  fs.copyFileSync(
    path.join(__dirname, 'public', 'tic-tac-toe-logo.svg'),
    path.join(__dirname, 'dist', 'tic-tac-toe-logo.svg')
  );
  console.log('Logo copied to dist root');
} catch (err) {
  console.error('Error copying logo:', err);
}

// Create 404.html
try {
  if (fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    fs.copyFileSync(
      path.join(__dirname, 'dist', 'index.html'),
      path.join(__dirname, 'dist', '404.html')
    );
    console.log('Created 404.html file');
  } else {
    console.error('index.html not found, could not create 404.html');
  }
} catch (err) {
  console.error('Error creating 404.html file:', err);
} 