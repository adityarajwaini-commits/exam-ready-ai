# ExamReady AI - Setup Instructions

## 📋 Overview
ExamReady AI is a SaaS study assistant that transforms student notes into exam-ready materials using Google Gemini AI.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Google Gemini API Key

### 2. Installation

```bash
# Install dependencies
yarn install
# or
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=examready_db
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key-change-this

CORS_ORIGINS=*
```

### 4. Run Development Server

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/
│   ├── page.js                    # Landing page
│   ├── layout.js                  # Root layout
│   ├── globals.css                # Global styles
│   ├── login/page.js              # Login page
│   ├── signup/page.js             # Signup page
│   ├── dashboard/page.js          # Main dashboard
│   └── api/[[...path]]/route.js   # API routes
├── lib/
│   ├── mongodb.js                 # MongoDB connection
│   ├── auth.js                    # JWT utilities
│   └── gemini.js                  # Google Gemini integration
├── components/ui/                 # shadcn/ui components
├── package.json
├── tailwind.config.js
└── next.config.js
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### AI Generation
- `POST /api/generate` - Generate study materials (requires auth)
  - Types: `summary`, `questions`, `mcqs`, `flashcards`, `revision`

### File Upload
- `POST /api/upload` - Upload and extract text from PDF/DOCX (requires auth)

### Usage Tracking
- `GET /api/usage` - Get usage statistics (requires auth)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is stored in localStorage after login/signup.

## 🤖 Google Gemini Setup

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env` as `GEMINI_API_KEY`
3. Model used: `gemini-2.5-flash` (configurable in `/lib/gemini.js`)

## 💾 MongoDB Setup

### Local MongoDB
```bash
# Start MongoDB
mongod --dbpath /path/to/data
```

### MongoDB Atlas
1. Create cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGO_URL` in `.env`

### Collections
- `users` - User accounts
- `generations` - Generation history

## 🎨 Features

### Free Plan
- 3 AI generations per day
- All generation types
- PDF & DOCX upload
- Copy to clipboard

### Pro Plan (Ready for Integration)
- Unlimited generations
- PDF download
- Priority support

## 📦 Dependencies

### Main
- Next.js 14
- React 18
- MongoDB driver
- @google/generative-ai
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- pdf-parse (PDF parsing)
- mammoth (DOCX parsing)
- tailwindcss
- shadcn/ui components

## 🛠️ Build for Production

```bash
# Build
yarn build

# Start production server
yarn start
```

## 🔧 Configuration

### Tailwind Config
Located in `tailwind.config.js` - includes shadcn/ui theme configuration.

### Next.js Config
Located in `next.config.js` - API route configuration.

## 📝 Usage Limits

Free users are limited to 3 generations per day. This resets at midnight (server time).

To modify limits, edit the logic in `/app/api/[[...path]]/route.js`:

```javascript
if (user.plan !== 'pro') {
  // Check daily limit (currently 3)
  if (todayUsage >= 3) {
    // Block generation
  }
}
```

## 🎯 Generation Types

1. **Summary** - Structured summaries with key points
2. **Questions** - Short and long answer questions
3. **MCQs** - Multiple choice with answers and explanations
4. **Flashcards** - Q&A format for quick revision
5. **Revision Sheet** - One-page study guide

## 🚨 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URL` in `.env`
- Verify network/firewall settings

### Gemini API Error
- Verify API key is valid
- Check API quota/limits
- Ensure billing is enabled (if required)

### Authentication Issues
- Clear localStorage and try again
- Verify JWT_SECRET is set
- Check token expiration (30 days default)

## 📄 License

This project is for educational/commercial use.

## 🙋 Support

For issues or questions, refer to:
- Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- MongoDB docs: [docs.mongodb.com](https://docs.mongodb.com)
- Gemini docs: [ai.google.dev](https://ai.google.dev)

## 🎉 Credits

Built with Next.js, MongoDB, Google Gemini AI, and shadcn/ui components.
