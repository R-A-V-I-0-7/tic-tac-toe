#!/usr/bin/env node

// Simple post-build script to copy assets
const fs = require('fs');
const path = require('path');

// Create .nojekyll file to prevent Jekyll processing on GitHub Pages
fs.writeFileSync(path.join(__dirname, 'dist', '.nojekyll'), '');

// Copy logo to dist root if it exists
const logoSource = path.join(__dirname, 'public', 'tic-tac-toe-logo.svg');
const logoTarget = path.join(__dirname, 'dist', 'tic-tac-toe-logo.svg');

if (fs.existsSync(logoSource)) {
  fs.copyFileSync(logoSource, logoTarget);
}

// Create 404.html from index.html
const indexHtml = path.join(__dirname, 'dist', 'index.html');
const notFoundHtml = path.join(__dirname, 'dist', '404.html');

if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, notFoundHtml);
} 