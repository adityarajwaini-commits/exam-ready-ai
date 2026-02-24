import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { hashPassword, verifyPassword, generateToken, getUserFromRequest } from '@/lib/auth';
import { generateStudyMaterial } from '@/lib/gemini';
import { v4 as uuidv4 } from 'uuid';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Helper to handle CORS
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

// Main API router
export async function POST(request) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    // AUTH ROUTES
    if (path === 'auth/signup') {
      return await handleSignup(request);
    }
    if (path === 'auth/login') {
      return await handleLogin(request);
    }
    
    // PROTECTED ROUTES (require authentication)
    if (path === 'generate') {
      return await handleGenerate(request);
    }
    if (path === 'upload') {
      return await handleUpload(request);
    }

    return NextResponse.json(
      { error: 'Route not found' },
      { status: 404, headers: corsHeaders() }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function GET(request) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    if (path === 'auth/me') {
      return await handleGetCurrentUser(request);
    }
    if (path === 'usage') {
      return await handleGetUsage(request);
    }

    return NextResponse.json(
      { error: 'Route not found' },
      { status: 404, headers: corsHeaders() }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// ============ AUTH HANDLERS ============

async function handleSignup(request) {
  const { email, password, name } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: 'Email, password, and name are required' },
      { status: 400, headers: corsHeaders() }
    );
  }

  const db = await getDb();
  const users = db.collection('users');

  // Check if user exists
  const existingUser = await users.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return NextResponse.json(
      { error: 'User already exists' },
      { status: 400, headers: corsHeaders() }
    );
  }

  // Create user
  const userId = uuidv4();
  const hashedPassword = hashPassword(password);
  
  await users.insertOne({
    userId,
    email: email.toLowerCase(),
    name,
    password: hashedPassword,
    plan: 'free',
    createdAt: new Date(),
  });

  const token = generateToken(userId);

  return NextResponse.json(
    { token, user: { userId, email, name, plan: 'free' } },
    { headers: corsHeaders() }
  );
}

async function handleLogin(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400, headers: corsHeaders() }
    );
  }

  const db = await getDb();
  const users = db.collection('users');

  const user = await users.findOne({ email: email.toLowerCase() });
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401, headers: corsHeaders() }
    );
  }

  const isValid = verifyPassword(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401, headers: corsHeaders() }
    );
  }

  const token = generateToken(user.userId);

  return NextResponse.json(
    { 
      token, 
      user: { 
        userId: user.userId, 
        email: user.email, 
        name: user.name, 
        plan: user.plan || 'free' 
      } 
    },
    { headers: corsHeaders() }
  );
}

async function handleGetCurrentUser(request) {
  const userId = getUserFromRequest(request);
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: corsHeaders() }
    );
  }

  const db = await getDb();
  const users = db.collection('users');
  const user = await users.findOne({ userId });

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404, headers: corsHeaders() }
    );
  }

  return NextResponse.json(
    { 
      user: { 
        userId: user.userId, 
        email: user.email, 
        name: user.name, 
        plan: user.plan || 'free' 
      } 
    },
    { headers: corsHeaders() }
  );
}

// ============ USAGE TRACKING ============

async function handleGetUsage(request) {
  const userId = getUserFromRequest(request);
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: corsHeaders() }
    );
  }

  const db = await getDb();
  const users = db.collection('users');
  const generations = db.collection('generations');

  const user = await users.findOne({ userId });
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404, headers: corsHeaders() }
    );
  }

  // Get today's usage
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayUsage = await generations.countDocuments({
    userId,
    createdAt: { $gte: today }
  });

  const limit = user.plan === 'pro' ? -1 : 3; // -1 means unlimited
  const remaining = limit === -1 ? -1 : Math.max(0, limit - todayUsage);

  return NextResponse.json(
    { 
      used: todayUsage,
      limit,
      remaining,
      plan: user.plan || 'free'
    },
    { headers: corsHeaders() }
  );
}

// ============ FILE UPLOAD HANDLER ============

async function handleUpload(request) {
  const userId = getUserFromRequest(request);
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: corsHeaders() }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.toLowerCase();
    let text = '';

    // Parse PDF
    if (filename.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      text = data.text;
    }
    // Parse DOCX
    else if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }
    else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF or DOCX' },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from file' },
        { status: 400, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { text: text.trim() },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// ============ AI GENERATION HANDLER ============

async function handleGenerate(request) {
  const userId = getUserFromRequest(request);
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: corsHeaders() }
    );
  }

  const { text, type } = await request.json();

  if (!text || !type) {
    return NextResponse.json(
      { error: 'Text and type are required' },
      { status: 400, headers: corsHeaders() }
    );
  }

  const db = await getDb();
  const users = db.collection('users');
  const generations = db.collection('generations');

  const user = await users.findOne({ userId });
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404, headers: corsHeaders() }
    );
  }

  // Check usage limit for free users
  if (user.plan !== 'pro') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayUsage = await generations.countDocuments({
      userId,
      createdAt: { $gte: today }
    });

    if (todayUsage >= 3) {
      return NextResponse.json(
        { error: 'Daily limit reached. Upgrade to Pro for unlimited generations.' },
        { status: 403, headers: corsHeaders() }
      );
    }
  }

  // Generate content with OpenAI
  try {
    const result = await generateStudyMaterial(text, type);

    // Save generation to database
    await generations.insertOne({
      generationId: uuidv4(),
      userId,
      type,
      inputLength: text.length,
      outputLength: result.length,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { result, type },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
