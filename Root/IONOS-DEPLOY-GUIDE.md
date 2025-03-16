# Deploying to IONOS Deploy Now

This guide will help you deploy your Next.js application to IONOS Deploy Now.

## Prerequisites

1. An IONOS Deploy Now account
2. Your GitHub repository connected to IONOS Deploy Now

## Setup Steps

1. **Create a Deploy Now Project**
   - Go to the [IONOS Deploy Now dashboard](https://ionos.com/hosting/deploy-now)
   - Click "Create a new project"
   - Select your GitHub repository
   - Choose "Next.js" as your framework

2. **Configure GitHub Secrets**
   - After creating your project, you'll receive the following values:
     - API Key
     - Service ID
     - Project ID
     - Branch ID
   - Add these as secrets in your GitHub repository:
     - IONOS_API_KEY
     - IONOS_SERVICE_ID
     - IONOS_PROJECT_ID
     - IONOS_BRANCH_ID

3. **Push Changes to GitHub**
   - The GitHub Actions workflow will automatically deploy your application to IONOS Deploy Now

## Troubleshooting

If you encounter any issues during deployment:

1. Check the GitHub Actions logs for error messages
2. Verify that your Next.js application builds successfully locally
3. Ensure all required environment variables are set correctly
4. Check the IONOS Deploy Now documentation for specific requirements

## Additional Resources

- [IONOS Deploy Now Documentation](https://docs.ionos.com/deploy-now)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

