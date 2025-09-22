# 🚀 Deployment Guide

This guide will help you deploy your Notion Notification Center to various hosting platforms.

## 📋 Prerequisites

- Node.js 16+ installed
- A hosting account (Vercel, Netlify, etc.)
- Your Notion integration set up

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add your Notion credentials:
     ```
     NOTION_CLIENT_ID=your_client_id
     NOTION_CLIENT_SECRET=your_client_secret
     NOTION_REDIRECT_URI=https://your-domain.vercel.app/auth/callback
     FRONTEND_URL=https://your-domain.vercel.app
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your widget will be available at your Vercel URL

### Option 2: Netlify

1. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with your GitHub account
   - Click "New site from Git"
   - Select your repository

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Set Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add your Notion credentials

4. **Deploy**
   - Click "Deploy site"
   - Your widget will be available at your Netlify URL

### Option 3: GitHub Pages

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "GitHub Actions" as source

2. **Create Workflow**
   - Create `.github/workflows/deploy.yml`
   - Add the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

3. **Deploy**
   - Push to main branch
   - GitHub Actions will automatically deploy
   - Your widget will be available at `https://yourusername.github.io/repository-name`

## 🔧 Environment Variables

Set these environment variables in your hosting platform:

```bash
# Notion OAuth (if using OAuth)
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=https://your-domain.com/auth/callback

# Frontend URL
FRONTEND_URL=https://your-domain.com

# Optional: Default database configuration
NOTION_TOKEN=your_integration_token
NOTION_DATABASE_ID=your_database_id
```

## 🎯 Custom Domain Setup

### For Vercel:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` environment variable

### For Netlify:
1. Go to Site Settings > Domain Management
2. Add your custom domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` environment variable

## ✅ Testing Your Deployment

1. **Visit your deployed URL**
2. **Test the setup flow**
   - Configure your Notion integration
   - Customize the appearance
   - Preview the widget

3. **Test the embed**
   - Copy the embed URL
   - Add it to a Notion page
   - Verify it works correctly

4. **Test on mobile**
   - Check the responsive design
   - Ensure it works on different screen sizes

## 🐛 Troubleshooting

### Common Issues

**Build fails**
- Check Node.js version (needs 16+)
- Verify all dependencies are installed
- Check for TypeScript errors

**Environment variables not working**
- Ensure variables are set in hosting platform
- Check variable names match exactly
- Restart deployment after adding variables

**OAuth not working**
- Verify redirect URI matches exactly
- Check client ID and secret are correct
- Ensure HTTPS is enabled

**Widget not loading**
- Check browser console for errors
- Verify API endpoints are accessible
- Check CORS settings

### Getting Help

1. Check the browser console for error messages
2. Review the deployment logs
3. Test locally first with `npm run dev`
4. Check your hosting platform's documentation

## 🎉 You're Live!

Once deployed, your Notion Notification Center will be available for users to:

1. **Set up their Notion integration**
2. **Customize the appearance**
3. **Embed in their Notion pages**
4. **Stay organized with their tasks**

Share your deployment URL with users and start helping them stay productive!
