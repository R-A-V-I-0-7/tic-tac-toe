#!/usr/bin/env node

// Simple post-build script to copy assets
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create .nojekyll file to prevent Jekyll processing on GitHub Pages
fs.writeFileSync(path.join(__dirname, 'dist', '.nojekyll'), '');

// Copy all files from public to dist
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

if (fs.existsSync(publicDir)) {
  // Create a function to copy files recursively
  const copyDir = (src, dest) => {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    // Read the contents of the source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        // Recursively copy directories
        copyDir(srcPath, destPath);
      } else {
        // Copy files
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${srcPath} -> ${destPath}`);
      }
    }
  };

  // Copy all files from public to dist
  copyDir(publicDir, distDir);
}

// Create 404.html from index.html
const indexHtml = path.join(__dirname, 'dist', 'index.html');
const notFoundHtml = path.join(__dirname, 'dist', '404.html');

if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, notFoundHtml);
  console.log('Created 404.html from index.html');
}

console.log('Post-build script completed successfully!'); 