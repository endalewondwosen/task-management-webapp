# Deployment Checklist

## Pre-Deployment

### Backend (API)
- [ ] Set up PostgreSQL database
- [ ] Create `.env` file with production values
- [ ] Generate secure `JWT_SECRET` (min 32 characters)
- [ ] Configure `DATABASE_URL`
- [ ] Set `FRONTEND_URL` for CORS
- [ ] Configure SMTP settings (if using email)
- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Build the project: `npm run build`
- [ ] Test production build locally
- [ ] Create `uploads` directory structure

### Frontend (Webapp)
- [ ] Set `VITE_API_URL` in `.env` or hosting platform
- [ ] Build for production: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Verify API connection works

## Deployment Steps

### Backend Deployment
1. [ ] Choose hosting platform (VPS, Railway, Render, Heroku, etc.)
2. [ ] Set environment variables on hosting platform
3. [ ] Deploy code (git push, Docker, or manual upload)
4. [ ] Run database migrations on production
5. [ ] Start the server (PM2, systemd, or platform service)
6. [ ] Verify health endpoint: `GET /health`
7. [ ] Test API endpoints

### Frontend Deployment
1. [ ] Choose hosting platform (Vercel, Netlify, S3, etc.)
2. [ ] Set `VITE_API_URL` environment variable
3. [ ] Deploy `dist` folder
4. [ ] Configure SPA routing (all routes → index.html)
5. [ ] Test the application
6. [ ] Verify API connection

## Post-Deployment

- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test file uploads
- [ ] Test email features (if configured)
- [ ] Monitor error logs
- [ ] Set up SSL/HTTPS certificates
- [ ] Configure domain names
- [ ] Set up monitoring/alerting
- [ ] Backup database
- [ ] Document deployment process

## Security Checklist

- [ ] Use strong `JWT_SECRET`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Use environment variables (never commit secrets)
- [ ] Enable database backups
- [ ] Set up firewall rules
- [ ] Review file upload limits
- [ ] Enable rate limiting (if needed)

## Quick Deploy Commands

### Backend
```bash
# Build
npm run build

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Start (with PM2)
pm2 start dist/server.js --name task-api
```

### Frontend
```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```



