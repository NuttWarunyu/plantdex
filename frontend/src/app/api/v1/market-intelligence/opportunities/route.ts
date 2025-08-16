import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data for now - จะเชื่อมต่อกับ Backend API จริงในภายหลัง
    const mockData = {
      opportunities: [
        {
          id: 1,
          plant_name: "มอนสเตอร่า",
          opportunity_type: "UNDERVALUED",
          confidence_score: 85,
          potential_upside_pct: 25,
          time_horizon_days: 30,
          detected_at: new Date().toISOString()
        },
        {
          id: 2,
          plant_name: "ฟิโลเดนดรอน",
          opportunity_type: "BREAKOUT",
          confidence_score: 78,
          potential_upside_pct: 18,
          time_horizon_days: 45,
          detected_at: new Date().toISOString()
        },
        {
          id: 3,
          plant_name: "แคคตัส",
          opportunity_type: "SEASONAL",
          confidence_score: 92,
          potential_upside_pct: 12,
          time_horizon_days: 60,
          detected_at: new Date().toISOString()
        }
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Market intelligence opportunities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 