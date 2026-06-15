import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { videoId, url } = await req.json();

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    let transcript = '';

    try {
      const pageRes = await fetch(
        `https://www.youtube.com/watch?v=${videoId}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0',
          },
        }
      );

      const html = await pageRes.text();

      const captionMatch = html.match(
        /"captionTracks":\[{"baseUrl":"([^"]+)"/
      );

      if (captionMatch) {
        const captionUrl = captionMatch[1].replace(
          /\\u0026/g,
          '&'
        );

        const captionRes = await fetch(captionUrl);
        const xml = await captionRes.text();

        const texts =
          xml.match(/<text[^>]*>([^<]*)<\/text>/g) || [];

        transcript = texts
          .map((t) =>
            t
              .replace(/<[^>]+>/g, '')
              .replace(/&amp;/g, '&')
              .replace(/&#39;/g, "'")
          )
          .join(' ')
          .slice(0, 6000);
      }
    } catch (err) {
      console.error('Transcript fetch failed:', err);
    }

    const prompt = `Extract 5-8 actionable steps from this video.

Return ONLY valid JSON:

{
  "title": "Roadmap Title",
  "steps": [
    {
      "order": 1,
      "title": "Step Title",
      "description": "What to do"
    }
  ]
}

Transcript:
${transcript || url}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : {};
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error?.message || 'Failed to process video',
      },
      {
        status: 500,
      }
    );
  }
}