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
    
    // 0. CHECK FOR DUPLICATES
    const existingProduct = await prisma.product.findFirst({
        where: { imageUrl: imageUrl },
        select: { name: true }
    });

    // 1. Fetch the image ONCE to use across all retry attempts
    const imageResp = await fetch(imageUrl);
    const buffer = await imageResp.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = imageResp.headers.get('content-type') || 'image/jpeg';

    const prompt = `Analyze this product image for "Glow by Connie", a luxury beauty boutique in Ghana. 
    Return a JSON object with:
    - name: A catchy, premium product name.
    - category: One of [Perfumes, Accessories, Beauty].
    - subCategory: A more specific sub-category (e.g. for Perfumes: "Oud", "Floral", "Intense"; for Accessories: "Bags", "Watches", "Wallets"; for Beauty: "Lipstick", "Skincare").
    - description: A persuasive, premium, 2-3 sentence description emphasizing elegance and quality.
    - price: A suggested retail price in Ghana Cedis (GHC) between 100 and 5000 based on the item type.
    
    Format: Only return the JSON. No preamble.`;

    let lastError = "All configured AI keys failed to generate a response.";
    
    // 2. FAILOVER LOOP: Try each key sequentially until one works
    for (let i = 0; i < keys.length; i++) {
        const activeKey = keys[i];
        console.log(`[AI] Attempt ${i + 1}/${keys.length} using ${activeKey.startsWith('ghp_') ? 'GitHub' : 'Gemini'} key: ${activeKey.substring(0, 8)}...`);

        try {
            let text = "";

            // PROVIDER 1: GitHub Models (ghp_ keys)
            if (activeKey.startsWith('ghp_') || activeKey.startsWith('github_')) {
                const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${activeKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            {
                                role: "user",
                                content: [
                                    { type: "text", text: prompt },
                                    { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } }
                                ]
                            }
                        ],
                        response_format: { type: "json_object" }
                    })
                });

                if (!response.ok) {
                    const errMsg = (await response.json())?.error?.message || response.statusText;
                    throw new Error(`GitHub Provider Error (${response.status}): ${errMsg}`);
                }

                const result = await response.json();
                text = result.choices[0].message.content;
            } 
            // PROVIDER 2: Google Gemini (AIza keys)
            else {
                const genAI = new GoogleGenerativeAI(activeKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await model.generateContent([
                    prompt,
                    { inlineData: { data: base64, mimeType } }
                ]);
                text = result.response.text();
            }

            // SUCCESS: Parse 
            console.log(`[AI] Success on attempt ${i + 1}`);
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(jsonStr);

            // Add duplicate warning if exists
            if (existingProduct) {
                data.duplicateWarning = `⚠️ WARNING: This image is already being used by "${existingProduct.name}". Please ensure you are not uploading a duplicate product.`;
            }

            return NextResponse.json(data);

        } catch (error: any) {
            console.warn(`[AI] Attempt ${i + 1} failed:`, error.message);
            lastError = error.message;
            // Continue to next key in loop
        }
    }

    // If we reach here, all keys failed
    throw new Error(`Tried all ${keys.length} keys but could not get a response. Last error: ${lastError}`);

  } catch (error: any) {
    console.error('[AI] Generation Total Failure:', error.message || error);
    return NextResponse.json({ 
        error: 'AI generation failed after trying all keys: ' + (error.message || "Unknown error") 
    }, { status: 500 });
  }
}
