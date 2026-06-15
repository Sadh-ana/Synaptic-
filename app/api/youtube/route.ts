import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

export async function POST(req: NextRequest) {
  try {
    const { videoId, url } = await req.json();

    let transcript = '';
    let title = 'YouTube Roadmap';

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

      const titleMatch = html.match(
        /<title>(.+?) - YouTube<\/title>/
      );

      if (titleMatch) title = titleMatch[1];

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
    } catch {
      transcript = `Video about: ${url}`;
    }

    const prompt = `Extract 5-8 actionable steps from this video.

Return ONLY valid JSON:

{
  "title": "Short roadmap title",
  "steps": [
    {
      "order": 1,
      "title": "Step title",
      "description": "What to do (1-2 sentences)"
    }
  ]
}

Transcript:
${transcript || `YouTube video: ${url}`}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(match?.[0] || '{}');
    }

    return NextResponse.json({
      ...data,
      title: data.title || title,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}