import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isAdmin = searchParams.get('admin') === 'true';
    
    const products = await prisma.product.findMany({
      where: {
        ...(category && category !== 'All' ? { category } : {}),
        ...(!isAdmin ? { isAvailable: true } : {})
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(products);
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        oldPrice: body.oldPrice ? parseFloat(body.oldPrice) : null,
        imageUrl: body.imageUrl,
        badgeLabel: body.badgeLabel || null,
        category: body.category,
        stock: parseInt(body.stock),
        lowStockThreshold: parseInt(body.lowStockThreshold),
        isAvailable: body.isAvailable ?? true
      }
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
