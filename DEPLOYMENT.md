# Deployment Guide - Task Management Webapp

## Prerequisites

- Node.js 18+ installed
- Backend API running and accessible

## Step 1: Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Set your API URL:
   ```env
   VITE_API_URL=https://api.your-domain.com/api
   ```

## Step 2: Build for Production

```bash
npm install
npm run build
```

This creates a `dist` folder with optimized production files.

## Step 3: Deploy Options

### Option 1: Static Hosting (Recommended)

Deploy the `dist` folder to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist` folder
- **GitHub Pages**: Use GitHub Actions
- **AWS S3 + CloudFront**: Upload to S3 bucket
- **Nginx**: Serve static files

### Option 2: Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/task-management-webapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Option 3: Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Set environment variable:
   ```bash
   vercel env add VITE_API_URL
   ```

### Option 4: Netlify Deployment

1. Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Deploy via Netlify dashboard or CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

## Step 4: Environment Variables

Set `VITE_API_URL` in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Nginx**: Use `.env` file or system environment variables

## Production Build Optimization

The build process:
- ✅ Minifies JavaScript and CSS
- ✅ Tree-shakes unused code
- ✅ Optimizes assets
- ✅ Creates source maps (for debugging)

## CORS Configuration

Ensure your backend API allows requests from your frontend domain:
```env
FRONTEND_URL=https://your-domain.com
```

## Testing Production Build Locally

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

## Troubleshooting

### API Connection Issues
- Check `VITE_API_URL` is set correctly
- Verify CORS settings on backend
- Check network/firewall rules

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### Routing Issues
- Ensure your hosting platform is configured for SPA routing (all routes → index.html)



