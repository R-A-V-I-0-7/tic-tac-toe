# Deployment Instructions

## Option 1: Using GitHub Desktop

1. Open GitHub Desktop
2. Choose "Add an Existing Repository"
3. Select the `tic-tac-toe` folder
4. Create a repository on GitHub with the name "tic-tac-toe"
5. Publish the repository to GitHub

## Option 2: Using git command line (if git is installed)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Create a new repository on GitHub.com first, then:
git remote add origin https://github.com/your-username/tic-tac-toe.git

# Push to GitHub
git push -u origin master
```

## Deploying to Netlify

1. Create a Netlify account at https://www.netlify.com/
2. Click "New site from Git"
3. Select GitHub and authorize Netlify
4. Select your tic-tac-toe repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

## Deploying to Vercel

1. Create a Vercel account at https://vercel.com/
2. Click "New Project"
3. Import from your GitHub repository
4. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"

## Deploying to GitHub Pages

1. Install the gh-pages package:
```bash
npm install --save-dev gh-pages
```

2. Add these scripts to your package.json:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist",
  // ...other scripts
}
```

3. Add homepage to package.json:
```json
"homepage": "https://your-username.github.io/tic-tac-toe"
```

4. Add base path to vite.config.js:
```javascript
export default defineConfig({
  base: '/tic-tac-toe/',
  // other config
})
```

5. Deploy to GitHub Pages:
```bash
npm run deploy
``` 