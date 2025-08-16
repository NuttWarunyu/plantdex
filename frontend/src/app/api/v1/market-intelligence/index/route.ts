import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data for now - จะเชื่อมต่อกับ Backend API จริงในภายหลัง
    const mockData = {
      plantdx_index: 1312.45,
      index_change_pct: "1.04",
      sentiment_score: 0.65,
      market_volume: 2500000,
      active_plants: 131
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Market intelligence index error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 