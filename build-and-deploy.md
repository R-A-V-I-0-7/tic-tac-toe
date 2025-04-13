# Build and Deploy Instructions

Follow these steps to build and deploy your Tic Tac Toe game:

## Prerequisites

Make sure you have Node.js and npm installed on your system.

## Step 1: Install Dependencies

```bash
# Navigate to the project directory
cd tic-tac-toe

# Install dependencies
npm install

# Install gh-pages package for GitHub Pages deployment
npm install --save-dev gh-pages
```

## Step 2: Build the Project

```bash
# Build the project
npm run build
```

This will create a `dist` folder with optimized production files.

## Step 3: Deploy Options

### Option 1: Deploy to GitHub Pages

1. Update the package.json file with your GitHub username:
```json
"homepage": "https://your-username.github.io/tic-tac-toe"
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

3. Visit your deployed site at: https://your-username.github.io/tic-tac-toe

### Option 2: Deploy to Netlify

1. Create a Netlify account
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Option 3: Deploy to Vercel

1. Create a Vercel account
2. Import your GitHub repository
3. Select Vite as the framework preset
4. Deploy

## Notes

- Remember to replace "your-username" with your actual GitHub username
- If you want to use a custom domain, update the CNAME file with your domain name
- Make sure your repository is public if you want to use GitHub Pages with a free account

## Updating Your Deployment

After making changes to your code:

1. Commit and push to GitHub
2. Run `npm run deploy` again for GitHub Pages
3. Netlify and Vercel will automatically redeploy when you push to GitHub 