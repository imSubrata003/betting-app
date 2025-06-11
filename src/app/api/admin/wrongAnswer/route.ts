import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const bajiId = await request.json();
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/game/undoreward`, {
        bajiId : bajiId.bajiId
    });
    return NextResponse.json(response.data);
}