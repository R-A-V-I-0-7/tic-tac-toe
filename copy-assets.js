import fs from 'fs';
import path from 'path';

// Make sure the public assets are copied to the root of the dist directory
console.log('Copying logo to dist root...');
try {
  fs.copyFileSync(
    path.resolve('./public/tic-tac-toe-logo.svg'),
    path.resolve('./dist/tic-tac-toe-logo.svg')
  );
  console.log('Logo copied successfully!');
} catch (err) {
  console.error('Error copying logo:', err);
} 