import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        location: body.location,
        items: body.items,
        totalAmount: parseFloat(body.totalAmount),
        status: 'PENDING'
      }
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
