import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'No query provided' }, { status: 400 });
    }

    const settings = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
    if (!settings?.geminiKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        subCategory: true
      }
    });

    const productsContext = products.map(p => 
      `ID: ${p.id} | Name: ${p.name} | Cat: ${p.category} | Sub: ${p.subCategory} | Desc: ${p.description}`
    ).join('\n');

    const prompt = `You are the AI Search Assistant for "Glow by Connie", a luxury boutique.
    User Query: "${query}"
    
    Inventory:
    ${productsContext}
    
    Analyze the user's intent (e.g., searching for "bags for men", "oud perfume", "gift for her").
    1. Identify the most relevant products from the inventory.
    2. If no direct matches exist, find the closest alternatives.
    3. If the query is completely unrelated to the shop, return an empty list.
    
    Return a JSON object with:
    - matches: Array of matching Product IDs.
    - suggestion: A short, friendly, luxury-toned message (e.g., "We don't have that belt yet, but these leather accessories are trending!")
    
    Only return JSON. No talk.`;

    const keys = settings.geminiKey.split(',').map(k => k.trim()).filter(k => k.length > 0);
    let lastError = "";

    for (let i = 0; i < keys.length; i++) {
      const activeKey = keys[i];
      try {
        let text = "";
        
        // GitHub Failover (ghp_ keys)
        if (activeKey.startsWith('ghp_') || activeKey.startsWith('github_')) {
          const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${activeKey}`
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" }
            })
          });
          if (!response.ok) throw new Error("GitHub search fail");
          const res = await response.json();
          text = res.choices[0].message.content;
        } 
        // Gemini (AIza keys)
        else {
          const genAI = new GoogleGenerativeAI(activeKey);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const result = await model.generateContent(prompt);
          text = result.response.text();
        }

        const data = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
        return NextResponse.json(data);

      } catch (err: any) {
        lastError = err.message;
        continue;
      }
    }

    return NextResponse.json({ error: 'Search AI keys exhausted: ' + lastError }, { status: 500 });

  } catch (error: any) {
    console.error('AI Search Error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
