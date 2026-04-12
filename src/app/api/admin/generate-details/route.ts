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
    const keys = settings.geminiKey.split(',').map(k => k.trim()).filter(k => k.length > 0);
    const activeKey = keys[Math.floor(Math.random() * keys.length)];
    
    if (!activeKey) throw new Error("No active AI key found.");

    // Fetch the image to send as binary
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

    let data;

    // PROVIDER 1: GitHub Models (ghp_ keys)
    if (activeKey.startsWith('ghp_') || activeKey.startsWith('github_')) {
      console.log("[AI] Using GitHub Models Provider");
      const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeKey}`
        },
        body: JSON.stringify({
          model: "gemini-1.5-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64}`
                  }
                }
              ]
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`GitHub AI Error: ${errData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      const text = result.choices[0].message.content;
      data = JSON.parse(text);

    } 
    // PROVIDER 2: Google Gemini (AIza keys)
    else {
      console.log("[AI] Using Google Gemini Provider");
      const genAI = new GoogleGenerativeAI(activeKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      data = JSON.parse(jsonStr);
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('AI Generation Error:', error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: 'AI generation failed: ' + msg }, { status: 500 });
  }
}
