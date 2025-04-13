#!/usr/bin/env node

// Simple post-build script to copy assets
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create .nojekyll file to prevent Jekyll processing on GitHub Pages
fs.writeFileSync(path.join(__dirname, 'dist', '.nojekyll'), '');
console.log('Created .nojekyll file');

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

// Create 404.html from index.html if it doesn't exist
const indexHtml = path.join(__dirname, 'dist', 'index.html');
const notFoundHtml = path.join(__dirname, 'dist', '404.html');

if (fs.existsSync(indexHtml) && !fs.existsSync(notFoundHtml)) {
  fs.copyFileSync(indexHtml, notFoundHtml);
  console.log('Created 404.html from index.html');
}

// Make sure _redirects file is copied
const redirectsFile = path.join(__dirname, 'dist', '_redirects');
if (!fs.existsSync(redirectsFile)) {
  fs.writeFileSync(redirectsFile, '/* /index.html 200');
  console.log('Created _redirects file');
}

// Make sure .htaccess and _headers files are copied
const sourceHtaccess = path.join(__dirname, 'public', '.htaccess');
const destHtaccess = path.join(__dirname, 'dist', '.htaccess');
if (fs.existsSync(sourceHtaccess)) {
  fs.copyFileSync(sourceHtaccess, destHtaccess);
  console.log('Copied .htaccess file');
}

const sourceHeaders = path.join(__dirname, 'public', '_headers');
const destHeaders = path.join(__dirname, 'dist', '_headers');
if (fs.existsSync(sourceHeaders)) {
  fs.copyFileSync(sourceHeaders, destHeaders);
  console.log('Copied _headers file');
}

// Copy netlify.toml if it exists
const sourceNetlify = path.join(__dirname, 'netlify.toml');
const destNetlify = path.join(__dirname, 'dist', 'netlify.toml');
if (fs.existsSync(sourceNetlify)) {
  fs.copyFileSync(sourceNetlify, destNetlify);
  console.log('Copied netlify.toml file');
}

// Create CNAME file for custom domain if needed
// Uncomment and modify if you have a custom domain
// fs.writeFileSync(path.join(__dirname, 'dist', 'CNAME'), 'your-custom-domain.com');

console.log('Post-build script completed successfully!'); 