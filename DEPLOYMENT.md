# Deployment Guide for Parcel Delivery API

## Vercel Deployment

### Prerequisites

1. A MongoDB Atlas cluster (or any MongoDB instance accessible via internet)
2. A Vercel account
3. Environment variables configured

### Environment Variables

Create these environment variables in your Vercel dashboard:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/parcel-delivery?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-minimum-32-characters
JWT_REFRESH_EXPIRES_IN=30d
BCRYPT_SALT_ROUNDS=12
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Deployment Steps

1. **Connect your GitHub repository to Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**

   - Framework Preset: Other
   - Build Command: `npm run build` (leave default)
   - Output Directory: Leave empty
   - Install Command: `npm install` (leave default)

3. **Add Environment Variables**

   - Go to Project Settings → Environment Variables
   - Add all the variables listed above

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### MongoDB Atlas Configuration

Make sure your MongoDB Atlas cluster allows connections from Vercel:

1. **Network Access**

   - Add `0.0.0.0/0` to allow all IPs (or use Vercel's IP ranges)

2. **Database User**
   - Create a database user with read/write permissions
   - Use the connection string in `MONGODB_URI`

### Troubleshooting

#### Common Issues:

1. **Timeout Errors**

   - Check MongoDB connection string
   - Ensure MongoDB Atlas allows connections from all IPs
   - Verify environment variables are set correctly

2. **Invalid Export Error**

   - This should be fixed with the updated `api/index.ts`
   - Make sure the file exports a default function

3. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check MongoDB Atlas network access settings
   - Ensure database user has proper permissions

#### Checking Logs:

- Go to Vercel Dashboard → Your Project → Functions tab
- Click on any function execution to see logs
- Check for specific error messages

### API Endpoints

After successful deployment, your API will be available at:

- Base URL: `https://your-project-name.vercel.app`
- Health Check: `https://your-project-name.vercel.app/`
- API Routes: `https://your-project-name.vercel.app/api/*`

### Testing Deployment

1. **Health Check**

   ```bash
   curl https://your-project-name.vercel.app/
   ```

2. **API Test**
   ```bash
   curl https://your-project-name.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpassword","role":"user"}'
   ```

### Performance Optimization

The deployment includes these optimizations:

- Reduced MongoDB connection pool size for serverless
- Shorter connection timeouts
- Disabled mongoose buffering
- Trust proxy settings for Vercel
- Proper CORS configuration

### Security Notes

- Always use strong, unique JWT secrets
- Keep environment variables secure
- Use HTTPS endpoints only
- Regularly rotate JWT secrets
- Monitor API usage and implement rate limiting if needed
