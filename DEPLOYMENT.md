# CI/CD Deployment Guide

This project is configured for automated deployment to both Vercel and Render using GitHub Actions.

## GitHub Actions Workflows

### 1. CI Pipeline (`ci.yml`)
- Runs on every push and pull request
- Tests on Node.js 18 and 20
- Performs linting, type checking, and builds
- Uploads build artifacts

### 2. Vercel Deployment (`deploy-vercel.yml`)
- Deploys to production on main/master branch pushes
- Creates preview deployments for pull requests
- Includes linting and build steps

### 3. Render Deployment (`deploy-render.yml`)
- Deploys to Render on main/master branch pushes
- Includes linting and build steps

## Setup Instructions

### Vercel Setup

1. **Create Vercel Project**
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

2. **Get Required Secrets**
   - Go to Vercel Dashboard → Settings → General
   - Copy your Project ID and Org ID
   - Go to Account Settings → Tokens → Create new token

3. **Add GitHub Secrets**
   Go to your GitHub repository → Settings → Secrets and variables → Actions:
   ```
   VERCEL_TOKEN=your_vercel_token
   VERCEL_ORG_ID=your_org_id
   VERCEL_PROJECT_ID=your_project_id
   ```

### Render Setup

1. **Create Render Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Create a new Static Site
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Get API Credentials**
   - Go to Account Settings → API Keys
   - Create a new API key
   - Get your Service ID from the service URL or dashboard

3. **Add GitHub Secrets**
   ```
   RENDER_API_KEY=your_render_api_key
   RENDER_SERVICE_ID=your_render_service_id
   ```

## Environment Variables

If your app needs environment variables, add them to:

### Vercel
```bash
vercel env add VITE_API_URL
```

### Render
Add in the Render dashboard under Environment Variables.

### GitHub Actions
Add as repository secrets for use during builds.

## Build Configuration

The project uses Vite with the following build setup:
- Build command: `npm run build`
- Output directory: `dist/`
- Node.js version: 18+

## Deployment Triggers

- **Production**: Push to `main` or `master` branch
- **Preview**: Pull requests (Vercel only)
- **CI**: All pushes and pull requests

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Verify environment variables are set

2. **Deployment Failures**
   - Verify GitHub secrets are correctly set
   - Check service IDs and API keys
   - Review build logs in Actions tab

3. **Vercel Issues**
   - Ensure vercel.json is properly configured
   - Check project settings in Vercel dashboard
   - Verify domain configuration

4. **Render Issues**
   - Check service configuration
   - Verify build and publish directories
   - Review deployment logs in Render dashboard

## Manual Deployment

### Vercel
```bash
vercel --prod
```

### Render
Deployments are triggered automatically via GitHub integration or can be manually triggered from the Render dashboard.