# Deployment Guide - Vercel Backend

This guide will help you deploy the backend API to Vercel (free hosting) so the Wix integration works properly.

## Why We Need This

The Wix API blocks direct browser requests (CORS issue). Our Vercel backend acts as a proxy, making server-side requests to Wix on your behalf.

## Prerequisites

- GitHub account (you already have this)
- Vercel account (free - sign up at https://vercel.com)

## Step-by-Step Deployment

### 1. Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### 2. Import Your Repository

1. Once logged in to Vercel, click "Add New..." → "Project"
2. Find "Femibyjojo" in your repository list
3. Click "Import"

### 3. Configure the Project

On the import screen:
- **Framework Preset:** Leave as "Other"
- **Root Directory:** Leave as `./`
- **Build Command:** Leave empty
- **Output Directory:** Leave empty
- **Install Command:** Leave empty

Click **"Deploy"**

### 4. Wait for Deployment

- Vercel will deploy your project (takes 1-2 minutes)
- You'll see a success screen with your deployment URL
- Your URL will be something like: `https://femibyjojo.vercel.app`

### 5. Update the Frontend Code

After deployment, you need to update one line in your code:

1. Open `inventory-manager-wix.html`
2. Find line ~700 where it says:
   ```javascript
   : 'https://femibyjojo.vercel.app/api/wix-proxy';
   ```
3. Replace `femibyjojo.vercel.app` with YOUR actual Vercel URL
4. Commit and push the change

### 6. Test the Connection

1. Go to your GitHub Pages site: https://zooman69.github.io/Femibyjojo/inventory-manager-wix.html
2. Click the Wix status indicator
3. Enter your Wix credentials (they should still be saved)
4. Click "Test Connection"
5. **It should work now!** No more CORS errors

## Troubleshooting

### "Function not found" error
- Make sure the `api` folder is in your repository
- Verify `vercel.json` exists in the root
- Redeploy on Vercel

### Still getting CORS errors
- Double-check the API_PROXY_URL in the HTML matches your Vercel URL
- Make sure you pushed the updated HTML to GitHub
- Clear your browser cache

### Connection timeout
- Check Vercel function logs in the Vercel dashboard
- Verify your Wix credentials are correct

## Your Deployment URLs

After setup, you'll have:
- **Frontend (GitHub Pages):** https://zooman69.github.io/Femibyjojo/
- **Backend (Vercel):** https://[your-project].vercel.app/api/wix-proxy

## Cost

- **Vercel Free Tier:** 100GB bandwidth/month, plenty for your needs
- **GitHub Pages:** Completely free
- **Total cost:** $0

## Next Steps

Once deployed and working:
1. Load your CSV in the inventory manager
2. Make changes to products
3. Click "Sync to Wix" to update your store
4. Export updated CSV for your records

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Check browser console (F12) for errors
3. Verify all files are in the repository
