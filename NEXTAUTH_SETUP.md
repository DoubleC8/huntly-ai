纸币 # NextAuth Setup Complete ✅

## What's Been Done

1. ✅ **AUTH_SECRET generated** - A secure random secret has been generated and added to `.env.local`
2. ✅ **Environment variables added** - Basic NextAuth configuration is in place

## ⚠️ IMPORTANT: You Need to Add Your GitHub OAuth Credentials

Your `.env.local` file needs actual GitHub OAuth credentials. Here's how to get them:

### Steps to Get GitHub OAuth Credentials:

1. **Go to GitHub Developer Settings**

   - Visit: https://github.com/settings/developers
   - Or: Profile → Settings → Developer settings → OAuth Apps

2. **Create a New OAuth App**

   - Click "New OAuth App"
   - Fill in the details:
     - **Application name**: Huntly AI (or your choice)
     - **Homepage URL**: http://localhost:3000 (for development)
     - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
     - Click "Register application"

3. **Get Your Credentials**
   - Copy the **Client ID**
   - Generate a **Client Secret** (click "Generate a new client secret")
4. **Update `.env.local`**
   Replace these placeholders in your `.env.local` file:
   ```bash
   GITHUB_CLIENT_ID=paste_your_client_id_here
   GITHUB_CLIENT_SECRET=paste_your_client_secret_here
   ```

### Current `.env.local` Status:

```bash
# ✅ Already set up
AUTH_SECRET=DwlSIme0tG9seBzHCNyVKwaxaynZyQNn33Tuwt5M7GY=

# ⚠️ Needs your actual values
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## For Production

When deploying to production, you'll need to:

1. **Update the GitHub OAuth App**

   - Change the Authorization callback URL to your production domain
   - Example: https://yourdomain.com/api/auth/callback/github

2. **Update environment variables in your hosting platform** (Vercel, Railway, etc.)
   - Add all three variables: `AUTH_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

## Testing

Once you've added your GitHub credentials, you can test the authentication:

```bash
npm run dev
```

Then visit http://localhost:3000 and click "Sign In" to test the GitHub OAuth flow.

## Need Help?

- NextAuth Docs: https://next-auth.js.org/
- GitHub OAuth Setup: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
