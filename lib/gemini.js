import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateStudyMaterial(text, type) {
  const systemPrompt = `You are an expert academic assistant for university students.
When given study notes, provide structured, exam-focused content.
Use clear headings, bullet points, and keep language simple.
Format your response in a clean, organized manner.`;

  let userPrompt = '';
  
  switch(type) {
    case 'summary':
      userPrompt = `Create a comprehensive structured summary of these notes. Include:
- Key definitions and concepts
- Important formulas (if any)
- Main points organized by topic

Notes:
${text}`;
      break;
      
    case 'questions':
      userPrompt = `Generate important exam questions from these notes:
1. Create 5 short-answer questions (2-3 marks each)
2. Create 3 long-answer questions (5-10 marks each)
3. Include hints for each question

Notes:
${text}`;
      break;
      
    case 'mcqs':
      userPrompt = `Generate 10 multiple-choice questions from these notes.
Format each as:
Q1. [Question]
a) [Option A]
b) [Option B]
c) [Option C]
d) [Option D]
Correct Answer: [Letter]
Explanation: [Brief explanation]

Notes:
${text}`;
      break;
      
    case 'flashcards':
      userPrompt = `Create 10 flashcards in Q&A format from these notes.
Format each as:
Card 1:
Q: [Question]
A: [Answer]

Notes:
${text}`;
      break;
      
    case 'revision':
      userPrompt = `Create a one-page revision sheet from these notes. Include:
- Key concepts (bullet points)
- Important definitions
- Critical formulas
- Must-remember points
- Quick tips for exam

Keep it concise and scannable.

Notes:
${text}`;
      break;
      
    default:
      userPrompt = text;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent([
      systemPrompt,
      userPrompt
    ]);
    
    const response = await result.response;
    const generatedText = response.text();

    return generatedText;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate content with AI');
  }
}
