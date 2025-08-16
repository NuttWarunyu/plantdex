import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { offer_id } = body;
    
    if (!offer_id) {
      return NextResponse.json(
        { error: 'Offer ID is required' },
        { status: 400 }
      );
    }

    // Mock transaction creation
    const mockTransaction = {
      transaction_id: `TXN_${Date.now()}`,
      offer_id: offer_id,
      status: 'CONFIRMED',
      created_at: new Date().toISOString(),
      estimated_completion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      transaction_id: mockTransaction.transaction_id,
      message: 'ข้อเสนอได้รับการยืนยันแล้ว'
    });
  } catch (error) {
    console.error('InstantBuy accept error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 