import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photos = formData.getAll('photos') as File[];
    
    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: 'No photos provided' },
        { status: 400 }
      );
    }

    // Mock AI evaluation for now
    const mockEvaluation = {
      id: `eval_${Date.now()}`,
      plant_species: "Monstera deliciosa",
      confidence_score: 85,
      estimated_market_price: 2500,
      our_offer_price: 2200,
      offer_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      evaluation_confidence: 0.85
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json(mockEvaluation);
  } catch (error) {
    console.error('InstantBuy evaluate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 