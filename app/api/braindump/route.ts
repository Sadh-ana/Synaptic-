import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const prompt = `Analyze this brain dump and categorize into Eisenhower Matrix.

Return ONLY valid JSON:

{
  "urgent-important": [{"title": "...", "description": "...", "deadline": "YYYY-MM-DD or null", "tags": ["..."]}],
  "not-urgent-important": [],
  "urgent-not-important": [],
  "not-urgent-not-important": []
}

Today is ${new Date().toISOString().split('T')[0]}.
Maximum 5 items per quadrant.

Brain dump:
${text}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let matrix;

    try {
      matrix = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      matrix = JSON.parse(match?.[0] || '{}');
    }

    return NextResponse.json({ matrix });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}