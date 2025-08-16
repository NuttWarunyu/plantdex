import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data for now - จะเชื่อมต่อกับ Backend API จริงในภายหลัง
    const mockData = {
      top_movers: [
        {
          id: 1,
          plant_name: "มอนสเตอร่า",
          price_change_pct: 15.2,
          current_price: 2500,
          volume_change_pct: 25.5,
          market_cap: 1250000,
          trend_direction: "up"
        },
        {
          id: 2,
          plant_name: "ฟิโลเดนดรอน",
          price_change_pct: 8.7,
          current_price: 1800,
          volume_change_pct: 18.3,
          market_cap: 980000,
          trend_direction: "up"
        },
        {
          id: 3,
          plant_name: "แคคตัส",
          price_change_pct: -3.1,
          current_price: 450,
          volume_change_pct: -5.2,
          market_cap: 320000,
          trend_direction: "down"
        }
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Market intelligence top movers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 