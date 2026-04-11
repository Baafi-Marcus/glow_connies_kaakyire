import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price ? parseFloat(body.price) : undefined,
        oldPrice: body.oldPrice !== undefined ? (body.oldPrice ? parseFloat(body.oldPrice) : null) : undefined,
        imageUrl: body.imageUrl,
        badgeLabel: body.badgeLabel !== undefined ? body.badgeLabel : undefined,
        category: body.category,
        isAvailable: body.isAvailable,
        stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
        lowStockThreshold: body.lowStockThreshold !== undefined ? parseInt(body.lowStockThreshold) : undefined,
      }
    });
    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
