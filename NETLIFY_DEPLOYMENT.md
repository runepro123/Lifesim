# Deploy Your Life Simulation Game to Netlify

Your app is now ready for Netlify deployment! Here's how to deploy it:

## Quick Deployment Steps

1. **Push your code to GitHub/GitLab**
   - Create a new repository on GitHub
   - Push all your project files to the repository

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select your life simulation game repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20`

4. **Set Environment Variables**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add: `DATABASE_URL` = `postgresql://neondb_owner:npg_9nXlEqferJp3@ep-raspy-poetry-a8r13muz-pooler.eastus2.azure.neon.tech/neondb?sslmode=require`

5. **Deploy**
   - Click "Deploy site"
   - Your app will be live at your-site-name.netlify.app

## What's Already Configured

✅ **Database Connection**: Connected to your Neon.tech PostgreSQL database
✅ **Static Files**: HTML file created for proper hosting
✅ **Build Process**: Configured to generate production files
✅ **API Routes**: Set up as serverless functions
✅ **Redirects**: Configured for single-page app routing

## File Structure Ready for Deployment

- `index.html` - Main HTML file for your app
- `netlify.toml` - Netlify configuration
- `netlify/functions/api.js` - Serverless API functions
- Database connection works with your Neon.tech database

Your life simulation game is fully prepared for Netlify hosting!