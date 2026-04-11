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

  const body = await req.json();
  const { geminiKey, cloudinaryUrl, whatsappNumber } = body;

  const settings = await prisma.storeSettings.update({
    where: { id: 'singleton' },
    data: {
      geminiKey,
      cloudinaryUrl,
      whatsappNumber,
    },
  });

  return NextResponse.json(settings);
}
