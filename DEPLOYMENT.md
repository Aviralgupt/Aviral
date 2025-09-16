# Deployment Guide - Aviral's Portfolio with AI Chatbot

This guide will help you deploy your portfolio website with Google Gemini AI chatbot to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Google AI Studio Account**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the generated API key (keep it secure!)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect the configuration
5. Before deploying, add environment variables:
   - Go to "Environment Variables" section
   - Add: `GEMINI_API_KEY` with your Google AI API key
   - Set environment to "Production"
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. Follow the prompts and set up environment variables when asked

## Step 3: Configure Environment Variables

After deployment, you need to add your Gemini API key:

1. Go to your project dashboard on Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Add the following variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Google AI API key
   - **Environment**: Production (and Preview if needed)
4. Click "Save"

## Step 4: Redeploy

After adding environment variables, redeploy your project:
- Go to "Deployments" tab
- Click "..." on the latest deployment
- Select "Redeploy"

## Step 5: Test Your Deployment

1. Visit your deployed website URL
2. Click the chat button in the bottom-right corner
3. Test the AI chatbot by asking questions about Aviral's experience
4. Verify that responses are generated properly

## Project Structure

```
portfolio-website/
├── index.html              # Main website
├── script.js               # Website functionality
├── chatbot.js              # Chatbot functionality
├── styles.css              # Website styles
├── package.json            # Dependencies
├── vercel.json             # Vercel configuration
├── env.example             # Environment variables template
├── api/
│   └── chat.js             # Serverless function for Gemini API
└── README.md               # Project documentation
```

## Key Features

### 🤖 AI Chatbot
- Powered by Google Gemini 1.5 Flash
- Comprehensive knowledge about Aviral's background
- Real-time conversations with context awareness
- Modern, responsive UI

### 🚀 Performance
- Optimized for Vercel's edge network
- Serverless API functions
- Fast loading times
- Mobile-responsive design

### 🔒 Security
- API key stored securely in environment variables
- CORS protection
- Input validation and sanitization
- XSS protection

## Troubleshooting

### Chatbot Not Working
1. Check if `GEMINI_API_KEY` environment variable is set correctly
2. Verify the API key is valid in Google AI Studio
3. Check browser console for error messages
4. Ensure the API endpoint `/api/chat` is accessible

### Environment Variables Not Loading
1. Make sure you've added them in Vercel dashboard
2. Redeploy after adding environment variables
3. Check the "Settings" → "Environment Variables" section

### Deployment Issues
1. Verify `package.json` and `vercel.json` are in root directory
2. Check build logs in Vercel dashboard
3. Ensure all files are committed to your Git repository

## Custom Domain (Optional)

To use a custom domain:
1. Go to your project settings in Vercel
2. Navigate to "Domains" section
3. Add your custom domain
4. Follow DNS configuration instructions

## Updates and Maintenance

To update your portfolio:
1. Make changes to your local files
2. Commit and push to your Git repository
3. Vercel will automatically redeploy
4. No need to manually redeploy unless changing environment variables

## Cost Information

- **Vercel**: Free tier includes generous limits for personal projects
- **Google Gemini API**: Currently free with rate limits (check current pricing)
- **Custom Domain**: Free with Vercel (you pay for domain registration separately)

## Support

If you encounter issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Check Google AI documentation: [ai.google.dev](https://ai.google.dev)
3. Contact Aviral at: aviralgupta@usf.edu

---

**Congratulations!** 🎉 Your portfolio with AI chatbot is now live and ready to showcase your work to the world!
