import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { transactionId } = params;
    
    // Mock transaction data
    const mockTransaction = {
      id: transactionId,
      transaction_id: transactionId,
      plant_species: "Monstera deliciosa",
      agreed_price: 2200,
      status: 'CONFIRMED' as const,
      pickup_location: "บ้านคุณ (กรุณาระบุที่อยู่)",
      pickup_scheduled_at: null, // จะนัดหมายภายหลัง
      payment_method: "เงินสดหรือโอนเงินทันที",
      seller_contact: {
        name: "กรุณาระบุชื่อ",
        phone: "กรุณาระบุเบอร์โทร",
        address: "กรุณาระบุที่อยู่"
      },
      created_at: new Date().toISOString(),
      estimated_completion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
    };

    return NextResponse.json(mockTransaction);
  } catch (error) {
    console.error('InstantBuy transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 