import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Analyze this brain dump and categorize into Eisenhower Matrix. Return ONLY valid JSON, no markdown:
{
  "urgent-important": [{"title": "...", "description": "...", "deadline": "YYYY-MM-DD or null", "tags": ["..."]}],
  "not-urgent-important": [...],
  "urgent-not-important": [...],
  "not-urgent-not-important": [...]
}

Today is ${new Date().toISOString().split('T')[0]}. Each quadrant max 5 items.

Brain dump: ${text}`
      }],
    });

    const raw = (response.content[0] as any).text;
    let matrix;
    try { matrix = JSON.parse(raw); }
    catch { const m = raw.match(/\{[\s\S]*\}/); matrix = JSON.parse(m![0]); }

    return NextResponse.json({ matrix });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}