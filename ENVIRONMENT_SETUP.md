# Environment Variables Setup

## Local Development

Create a `.env.local` file in the root directory with:

```bash
# Local development environment variables
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

## Vercel Production Deployment

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following environment variable:

**Key:** `REACT_APP_API_BASE_URL`  
**Value:** `https://exe201-be-uhno.onrender.com/api`  
**Environment:** Production (and Preview if needed)

4. After adding the environment variable, redeploy your project.

## Important Notes

- Environment variables in Create React App are build-time variables
- They must start with `REACT_APP_` to be accessible in the browser
- Changes to environment variables require a redeploy on Vercel
- Never commit `.env.local` files to version control
