import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ evaluationId: string }> }
) {
  try {
    const { evaluationId } = await params;
    
    // Mock offer data for now
    const mockOffer = {
      id: evaluationId,
      evaluation_id: evaluationId,
      plant_species: "Monstera deliciosa",
      estimated_market_price: 2500,
      our_offer_price: 2200,
      offer_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      pickup_terms: "เรามารับต้นไม้ที่บ้านคุณ ภายใน 2-3 วันทำการ",
      payment_method: "เงินสดหรือโอนเงินทันที",
      ai_identification: {
        species: "Monstera deliciosa",
        confidence: 85
      },
      photos: [
        "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&h=300&fit=crop"
      ],
      price_reasoning: "ราคาตลาดปัจจุบันอยู่ที่ ฿2,500 แต่เราขอเสนอ ฿2,200 เนื่องจากต้นไม้มีขนาดปานกลางและสภาพดี ราคานี้เป็นราคาที่ยุติธรรมสำหรับทั้งสองฝ่าย"
    };

    return NextResponse.json(mockOffer);
  } catch (error) {
    console.error('InstantBuy offer error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 