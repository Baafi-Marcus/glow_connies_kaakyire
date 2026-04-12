import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const token = (await cookies()).get('admin_session')?.value;
  if (token !== 'KA-AUTHENTICATED') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ids, action } = await req.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    let resultMsg = "";

    if (action === 'DELETE') {
      const deleteResult = await prisma.product.deleteMany({
        where: { id: { in: ids } }
      });
      resultMsg = `Deleted ${deleteResult.count} products`;
    } else if (action === 'PUBLISH') {
      const updateResult = await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { isAvailable: true }
      });
      resultMsg = `Published ${updateResult.count} products to the storefront`;
    } else if (action === 'HIDE') {
      const updateResult = await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { isAvailable: false }
      });
      resultMsg = `Hid ${updateResult.count} products from the storefront`;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    console.log(`[API] Bulk ${action}: ${resultMsg}`);
    
    return NextResponse.json({ message: resultMsg });
  } catch (error: any) {
    console.error(`[API] Bulk ${action} Error:`, error.message || error);
    return NextResponse.json({ 
      error: `Bulk ${action} failed: ` + (error.message || 'Database error')
    }, { status: 500 });
  }
}
