# Deploy Frontend to Vercel

## 🚀 Step-by-Step Guide

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com - free with GitHub)
- Backend API deployed (Render)

## Step 1: Prepare Your Code

1. **Push to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify these files exist:**
   - ✅ `package.json` with build script
   - ✅ `vite.config.ts`
   - ✅ `vercel.json` (already created)

## Step 2: Deploy via Vercel Dashboard

### Option A: GitHub Integration (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository:
   - Select `task-management-webapp` repository
   - Click **"Import"**
4. Configure project:

### Project Settings
- **Framework Preset**: `Vite` (auto-detected)
- **Root Directory**: Leave empty (or `task-management-webapp` if monorepo)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install`

### Environment Variables
Click **"Environment Variables"** and add:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `https://your-api-name.onrender.com/api` | Production, Preview, Development |

**Important**: Replace `your-api-name.onrender.com` with your actual Render API URL

5. Click **"Deploy"**

### Option B: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd task-management-webapp
   vercel
   ```

4. **Set environment variable:**
   ```bash
   vercel env add VITE_API_URL production
   # Enter: https://your-api-name.onrender.com/api
   ```

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Step 3: Verify Deployment

1. Wait for deployment (usually 1-2 minutes)
2. Vercel will provide a URL like:
   ```
   https://task-management-webapp.vercel.app
   ```
3. Visit the URL and test:
   - ✅ Login works
   - ✅ API calls succeed
   - ✅ No console errors

## Step 4: Configure Custom Domain (Optional)

1. Go to project settings → **"Domains"**
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificate is automatic

## Step 5: Update Backend CORS

1. Go to your Render dashboard
2. Update `FRONTEND_URL` environment variable:
   ```
   https://your-frontend.vercel.app
   ```
3. Redeploy the service (or it will auto-update)

## 🔧 Configuration Files

### vercel.json (Already Created)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures SPA routing works correctly.

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify `package.json` has correct scripts
- Ensure Node.js version is compatible (Vercel uses 18.x by default)

### API Connection Errors
- Verify `VITE_API_URL` is set correctly
- Check CORS settings on backend
- Ensure backend `FRONTEND_URL` matches Vercel URL
- Check browser console for specific errors

### Routing Issues (404 on refresh)
- Verify `vercel.json` has rewrite rules
- Check that all routes redirect to `/index.html`

### Environment Variables Not Working
- Ensure variable name starts with `VITE_`
- Redeploy after adding variables
- Check variable is set for correct environment (Production/Preview/Development)

## 📝 Environment Variables

Vercel supports different environments:
- **Production**: Live site
- **Preview**: Pull request previews
- **Development**: Local development

Set `VITE_API_URL` for all environments, or use different URLs:
- Production: `https://api.your-domain.com/api`
- Preview: `https://api-preview.onrender.com/api`
- Development: `http://localhost:4000/api`

## 🎯 Vercel Features

### Automatic Deployments
- **Production**: Deploys on push to main branch
- **Preview**: Creates preview for every PR
- **Rollback**: Easy rollback to previous deployments

### Analytics (Optional)
- Enable in project settings
- View page views, performance metrics

### Speed Insights
- Automatic performance monitoring
- Core Web Vitals tracking

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build successful
- [ ] Site accessible
- [ ] Login works
- [ ] API connection verified
- [ ] Backend CORS updated

## 🔄 Continuous Deployment

Once set up:
1. Push to `main` branch → Auto-deploys to production
2. Create PR → Auto-creates preview deployment
3. Merge PR → Deploys to production

## 🎯 Next Steps

1. ✅ Frontend deployed to Vercel
2. ✅ Backend deployed to Render
3. ✅ CORS configured
4. ✅ Environment variables set
5. 🎉 Your app is live!

## 💡 Pro Tips

- Use Vercel's preview deployments to test before merging
- Set up custom domain for professional look
- Enable analytics to track usage
- Use Vercel's edge functions if needed (future enhancement)


