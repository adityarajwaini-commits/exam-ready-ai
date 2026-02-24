# 🔐 ExamReady AI - Environment Variables Guide

## Complete .env Configuration

```env
# MongoDB Database Connection
MONGODB_URI=mongodb://localhost:27017

# Database Name
DB_NAME=examready_db

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google Gemini API Key
GEMINI_API_KEY=AIzaSyCfd337B94VRVAs3k2xHklDw1xyJyLIkuA

# Authentication Secret (64-character secure key)
NEXTAUTH_SECRET=a5373d7be6f42f6dc144a7e6b4c13db22a91ddada639852faaee216ea164f248

# CORS Origins
CORS_ORIGINS=*
```

---

## 📝 Variable Explanations

### 1. MONGODB_URI
**What it is:** MongoDB database connection string

**Options:**

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017
```

**MongoDB Atlas (Cloud - Recommended):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/examready_db?retryWrites=true&w=majority
```

**How to get MongoDB Atlas URI:**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a FREE cluster (M0 tier)
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Replace `<username>` and `<password>`

---

### 2. NEXTAUTH_SECRET
**What it is:** Secret key for JWT token encryption

**Your secure key:**
```env
NEXTAUTH_SECRET=a5373d7be6f42f6dc144a7e6b4c13db22a91ddada639852faaee216ea164f248
```

✅ **Already generated for you** - This is a cryptographically secure 64-character hex string

**To generate a new one:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

⚠️ **IMPORTANT:** 
- NEVER share this publicly
- Use different secrets for dev/production
- Keep it secure like a password

---

### 3. GEMINI_API_KEY
**What it is:** Google Gemini AI API key for content generation

**Your key:**
```env
GEMINI_API_KEY=AIzaSyCfd337B94VRVAs3k2xHklDw1xyJyLIkuA
```

✅ **Already provided** - This key is working

**To get a new key:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

**Pricing:** Free tier available with generous limits

---

### 4. DB_NAME
**What it is:** MongoDB database name

```env
DB_NAME=examready_db
```

**Default:** `examready_db`
**Can change to:** Any name you prefer (e.g., `examready_production`)

---

### 5. NEXT_PUBLIC_BASE_URL
**What it is:** Your application's base URL

**Development:**
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Production:**
```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

### 6. CORS_ORIGINS
**What it is:** Allowed origins for API requests

**Development:**
```env
CORS_ORIGINS=*
```

**Production (Recommended):**
```env
CORS_ORIGINS=https://yourdomain.com
```

---

## 🚀 Quick Setup

### Step 1: Create .env file
```bash
cp .env.example .env
```

### Step 2: Edit .env file
```bash
nano .env
# or
code .env
```

### Step 3: Add your values
Use the values provided above or generate new ones.

### Step 4: Verify
```bash
# Make sure .env is in .gitignore
cat .gitignore | grep .env
```

---

## 🔒 Security Best Practices

1. ✅ **NEVER commit .env to Git**
   - Already in .gitignore
   
2. ✅ **Use different secrets per environment**
   - Development: One NEXTAUTH_SECRET
   - Production: Different NEXTAUTH_SECRET

3. ✅ **Restrict MongoDB access**
   - Use IP whitelist in MongoDB Atlas
   - Use strong passwords

4. ✅ **Rotate API keys regularly**
   - Generate new Gemini API keys periodically
   - Update NEXTAUTH_SECRET on breaches

5. ✅ **Use environment-specific URLs**
   - localhost for dev
   - Real domain for production

---

## 🧪 Testing Your Configuration

```bash
# Start the app
yarn dev

# Test endpoints
curl http://localhost:3000/api/auth/me
```

**Expected:** Server starts without errors

**Common Issues:**
- ❌ "Please add MONGODB_URI to .env" → Add MONGODB_URI
- ❌ MongoDB connection failed → Check MONGODB_URI
- ❌ Gemini API error → Verify GEMINI_API_KEY

---

## 📦 For Deployment

### Vercel:
1. Go to project settings
2. Add environment variables:
   - MONGODB_URI
   - NEXTAUTH_SECRET
   - GEMINI_API_KEY
   - DB_NAME
   - NEXT_PUBLIC_BASE_URL
   - CORS_ORIGINS

### Docker:
```dockerfile
ENV MONGODB_URI=mongodb://...
ENV NEXTAUTH_SECRET=your_secret
ENV GEMINI_API_KEY=your_key
```

---

## 📞 Support

If you have issues:
1. Check all variables are set
2. Verify MongoDB is accessible
3. Test Gemini API key validity
4. Restart the development server

---

**✅ Your configuration is production-ready!**
