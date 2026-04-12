import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  const token = (await cookies()).get('admin_session')?.value;
  if (token !== 'KA-AUTHENTICATED') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await prisma.storeSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      whatsappNumber: '233246702043',
    },
  });

  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const token = (await cookies()).get('admin_session')?.value;
  if (token !== 'KA-AUTHENTICATED') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Construct the update data object only with provided fields
    const data: any = {};
    if (body.geminiKey !== undefined) data.geminiKey = body.geminiKey;
    if (body.cloudinaryUrl !== undefined) data.cloudinaryUrl = body.cloudinaryUrl;
    if (body.whatsappNumber !== undefined) data.whatsappNumber = body.whatsappNumber;

    const settings = await prisma.storeSettings.update({
      where: { id: 'singleton' },
      data
    });

    console.log(`[API] Settings partial update success for fields: ${Object.keys(data).join(', ')}`);
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('[API] Settings Update Error:', error.message || error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
