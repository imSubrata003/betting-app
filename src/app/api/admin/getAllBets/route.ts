import axios from 'axios';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bet/getallbets`
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Failed to fetch bets:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch bets' },
      { status: 500 }
    );
  }
};
