# GitHub Secrets Required for CI/CD Deployment

To set up CI/CD deployment with GitHub Actions and Render, you need to configure the following secrets in your GitHub repository:

## Repository Settings > Secrets and variables > Actions

### Required Secrets

#### TMDB API Configuration
- `VITE_TMDB_API_KEY`: Your TMDB API key from [The Movie Database](https://www.themoviedb.org/settings/api)
  - Get your API key from TMDB account settings

#### Backend API Configuration
- `VITE_API_BASE_URL`: URL of your backend API service
  - Example: `https://your-backend-api.onrender.com` or `https://api.cineverse.com`

#### Render Deployment Secrets
- `RENDER_SERVICE_ID`: Your Render service ID
  - Find this in your Render dashboard under your static site service settings
  - Example: `srv-xxxxxxxxxxxxxxxx`

- `RENDER_API_KEY`: Your Render API key
  - Generate this in your Render account settings under "API Keys"
  - Example: `rnd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### How to Add Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click "Secrets and variables" > "Actions"
4. Click "New repository secret"
5. Enter the secret name and value
6. Click "Add secret"

### Verification

After adding all secrets, you can verify the setup by:
1. Pushing a commit to the main branch to trigger the CI/CD workflow
2. Check the "Actions" tab in GitHub to see if the workflow runs successfully
3. Verify deployment on your Render dashboard

### Troubleshooting

- **Workflow fails with "secret not found"**: Double-check secret names match exactly (case-sensitive)
- **Render deployment fails**: Ensure RENDER_SERVICE_ID and RENDER_API_KEY are correct
- **Build fails**: Check that VITE_TMDB_API_KEY is valid and accessible

### Security Notes

- Never commit secrets directly to code
- Rotate API keys periodically
- Use different keys for different environments if needed
- Monitor secret usage in GitHub's security insights
