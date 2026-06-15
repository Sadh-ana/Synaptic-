import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    });

    const prompt = `Analyze this brain dump and categorize it into an Eisenhower Matrix.

Return ONLY valid JSON in this format:

{
  "urgent-important": [],
  "not-urgent-important": [],
  "urgent-not-important": [],
  "not-urgent-not-important": []
}

Brain dump:
${text}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let matrix;

    try {
      matrix = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      matrix = match ? JSON.parse(match[0]) : {};
    }

    return NextResponse.json({ matrix });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error?.message || 'Failed to process brain dump',
      },
      {
        status: 500,
      }
    );
  }
}