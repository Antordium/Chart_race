# Deployment Guide

## Quick Start: Deploy to Vercel in 2 Minutes

### Prerequisites
- A Vercel account (free at [vercel.com](https://vercel.com))
- Git installed (optional, for GitHub method)

### Method 1: Vercel CLI (Fastest)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to project**
   ```bash
   cd Chart_race-main
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow prompts**
   - Login to Vercel (if first time)
   - Confirm project settings
   - Wait ~30 seconds
   - Get your live URL!

### Method 2: GitHub + Vercel

1. **Initialize Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Chart Race"
   ```

2. **Create GitHub Repository**
   - Go to [github.com/new](https://github.com/new)
   - Create a new repository named `chart-race`
   - Don't initialize with README

3. **Push Code**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/chart-race.git
   git branch -M main
   git push -u origin main
   ```

4. **Deploy on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"
   - Done!

### Method 3: Drag & Drop

1. Go to [vercel.com](https://vercel.com)
2. Sign in
3. Drag the entire `Chart_race-main` folder onto the page
4. Wait for deployment
5. Get your URL!

## Project Structure

This is a **static website** with:
- No build process required
- No server-side code
- Works entirely in the browser
- Uses localStorage for data persistence

### Files Deployed:
```
Chart_race-main/
├── index.html          (Main page)
├── assets/
│   ├── chart.js       (Chart logic)
│   ├── main.js        (App initialization)
│   └── styles.css     (Styling)
├── vercel.json        (Deployment config)
└── package.json       (Project metadata)
```

## Configuration

### Vercel Configuration (vercel.json)
The project includes a pre-configured `vercel.json` file with:
- Static file serving
- Security headers
- Optimized caching

**No changes needed** - it works out of the box!

### Custom Domain (Optional)

After deployment:
1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Features

### Data Persistence
- CSV data is stored in browser localStorage
- Persists across page refreshes
- Unique per domain (your Vercel URL)
- No backend required

### CSV Upload
- Upload via settings panel (⚙️)
- Automatic validation
- Error messages for invalid format
- Download sample CSV for reference

### Customization
All customization is client-side:
- Background images
- Corner logos
- Animation speed
- Chart title (click to edit)

## Troubleshooting

### Deployment Issues

**Error: "No index.html found"**
- Ensure you're deploying from the root directory
- Check that `index.html` exists in the project root

**Error: "Build failed"**
- This is a static site - no build needed
- Check that `vercel.json` is present
- Try removing `package.json` and deploying again

### Data Not Persisting
- localStorage is domain-specific
- Clearing browser data removes stored CSV
- Each deployment URL has separate storage

### Chart Not Loading
- Open browser console (F12)
- Check for JavaScript errors
- Verify D3.js CDN is accessible
- Try clearing browser cache

## Environment Variables

This project doesn't use environment variables. All configuration is:
- Client-side only
- Set via UI (settings panel)
- Stored in localStorage

## Performance

### Optimization
- D3.js loaded from CDN
- Minimal JavaScript
- No external dependencies
- Responsive images

### Expected Load Times
- First load: ~1-2 seconds
- Subsequent loads: ~200-500ms
- Animation: 60fps smooth

## Security

The included `vercel.json` sets these headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

All safe for production deployment!

## Updates

To update your deployed site:

**Using Vercel CLI:**
```bash
vercel --prod
```

**Using GitHub:**
- Push to main branch
- Vercel auto-deploys

**Using Drag & Drop:**
- Drag updated folder
- Overwrites previous deployment

## Support

- Issues: Create an issue on GitHub
- Documentation: See README.md
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)

## License

MIT - Free to use and modify
