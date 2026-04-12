import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const token = (await cookies()).get('admin_session')?.value;
  if (token !== 'KA-AUTHENTICATED') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ids } = await req.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided for deletion' }, { status: 400 });
    }

    const deleteResult = await prisma.product.deleteMany({
      where: {
        id: { in: ids }
      }
    });

    console.log(`[API] Bulk deleted ${deleteResult.count} products`);
    
    return NextResponse.json({ 
      message: `Successfully deleted ${deleteResult.count} products`,
      count: deleteResult.count 
    });
  } catch (error: any) {
    console.error('[API] Bulk Deletion Error:', error.message || error);
    return NextResponse.json({ 
      error: 'Bulk delete failed: ' + (error.message || 'Database error')
    }, { status: 500 });
  }
}
