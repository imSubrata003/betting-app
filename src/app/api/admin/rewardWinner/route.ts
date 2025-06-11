import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const bajiId = await request.json();
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/game/rewardwinner`, {
            bajiId: bajiId.bajiId
        });
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to reward winner" }, { status: 500 });
    }
}