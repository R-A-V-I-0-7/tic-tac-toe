#!/usr/bin/env node

// Simple script to copy necessary files to the dist directory
const fs = require('fs');
const path = require('path');

console.log('Starting post-build asset handling...');

// Create dist directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  try {
    fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
    console.log('Created dist directory');
  } catch (err) {
    console.error('Error creating dist directory:', err);
  }
}

// Create .nojekyll file
try {
  fs.writeFileSync(path.join(__dirname, 'dist', '.nojekyll'), '');
  console.log('Created .nojekyll file');
} catch (err) {
  console.error('Error creating .nojekyll file:', err);
}

// Check if public directory exists
if (!fs.existsSync(path.join(__dirname, 'public'))) {
  console.log('Public directory not found, skipping logo copy');
} else {
  // Copy logo to dist root if it exists
  const logoPath = path.join(__dirname, 'public', 'tic-tac-toe-logo.svg');
  if (fs.existsSync(logoPath)) {
    try {
      fs.copyFileSync(
        logoPath,
        path.join(__dirname, 'dist', 'tic-tac-toe-logo.svg')
      );
      console.log('Logo copied to dist root');
    } catch (err) {
      console.error('Error copying logo:', err);
    }
  } else {
    console.log('Logo file not found in public directory');
  }
}

// Create 404.html from index.html if it exists
if (fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
  try {
    fs.copyFileSync(
      path.join(__dirname, 'dist', 'index.html'),
      path.join(__dirname, 'dist', '404.html')
    );
    console.log('Created 404.html file');
  } catch (err) {
    console.error('Error creating 404.html file:', err);
  }
} else {
  console.error('index.html not found, could not create 404.html');
}

console.log('Post-build asset handling complete!'); 