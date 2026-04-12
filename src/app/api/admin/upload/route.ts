import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const token = (await cookies()).get('admin_session')?.value;
  if (token !== 'KA-AUTHENTICATED') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get Cloudinary config from DB
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings?.cloudinaryUrl) {
    return NextResponse.json({ error: 'Cloudinary not configured in Settings' }, { status: 400 });
  }

  // Configure Cloudinary by parsing URL explicitly
  const url = settings.cloudinaryUrl;
  const match = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
  
  if (match) {
    cloudinary.config({
      api_key: match[1],
      api_secret: match[2],
      cloud_name: match[3]
    });
  } else {
    // Fallback if URL is malformed
    cloudinary.config({
      cloudinary_url: url
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        folder: 'glow-products',
        resource_type: 'auto'
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(buffer);
    }) as unknown as { secure_url: string };

    return NextResponse.json({ url: result.secure_url });
  } catch (error: unknown) {
    console.error('Upload Error:', error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: 'Upload failed: ' + msg }, { status: 500 });
  }
}
