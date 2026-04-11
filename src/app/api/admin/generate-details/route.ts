import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const token = (await cookies()).get('admin_session')?.value;
  if (token !== 'KA-AUTHENTICATED') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings?.geminiKey) {
    return NextResponse.json({ error: 'Gemini AI Key not configured in Settings' }, { status: 400 });
  }

  const { imageUrl } = await req.json();
  if (!imageUrl) {
    return NextResponse.json({ error: 'No image provided for AI analysis' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(settings.geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Fetch the image to send as binary to Gemini
    const imageResp = await fetch(imageUrl);
    const buffer = await imageResp.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = imageResp.headers.get('content-type') || 'image/jpeg';

    const prompt = `Analyze this product image for "Glow by Connie", a luxury beauty boutique in Ghana. 
    Return a JSON object with:
    - name: A catchy, premium product name.
    - category: One of [Perfumes, Accessories, Beauty].
    - description: A persuasive, premium, 2-3 sentence description emphasizing elegance and quality.
    - price: A suggested retail price in Ghana Cedis (GHC) between 100 and 5000 based on the item type.
    
    Format: Only return the JSON. No preamble.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType
        }
      }
    ]);

    const text = result.response.text();
    // Extract JSON from potential Markdown blocks
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: 'AI generation failed: ' + error.message }, { status: 500 });
  }
}
