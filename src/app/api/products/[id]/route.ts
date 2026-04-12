import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const productData: any = {
      name: body.name,
      description: body.description,
      price: body.price ? parseFloat(body.price) : undefined,
      oldPrice: body.oldPrice !== undefined ? (body.oldPrice ? parseFloat(body.oldPrice) : null) : undefined,
      imageUrl: body.imageUrl,
      images: body.images,
      videoUrl: body.videoUrl !== undefined ? body.videoUrl : undefined,
      badgeLabel: body.badgeLabel !== undefined ? body.badgeLabel : undefined,
      category: body.category,
      subCategory: body.subCategory !== undefined ? body.subCategory : undefined,
      isAvailable: body.isAvailable,
      stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
      lowStockThreshold: body.lowStockThreshold !== undefined ? parseInt(body.lowStockThreshold) : undefined,
    };

    if (body.variants !== undefined) {
      // Overwrite variants: Delete old, create new
      productData.variants = {
        deleteMany: {},
        create: body.variants.map((v: any) => ({
          name: v.name,
          price: parseFloat(v.price),
          oldPrice: v.oldPrice ? parseFloat(v.oldPrice) : null,
          stock: parseInt(v.stock)
        }))
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productData,
      include: { variants: true }
    });
    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    console.log(`[API] Attempting to delete product: ${id}`);
    
    if (!id) throw new Error("Missing product ID");

    const deletedProduct = await prisma.product.delete({ where: { id } });
    console.log(`[API] Successfully deleted product: ${deletedProduct.name}`);
    
    return NextResponse.json({ message: 'Product deleted successfully', id });
  } catch (error: any) {
    console.error('[API] Product Deletion Error:', error.message || error);
    return NextResponse.json({ 
      error: 'Delete failed: ' + (error.message || 'Database error'),
      details: error.meta || {} 
    }, { status: 500 });
  }
}
