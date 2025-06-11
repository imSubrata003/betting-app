import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/game/getallgames`);
    const data = res.data;

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('[GET error]', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
