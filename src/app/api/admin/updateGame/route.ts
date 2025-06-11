import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { gameId, name, image, status } = await req.json()
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/game/editgame`, {
            gameId, name, image, status
        })
        //console.log(res.data);
        return NextResponse.json(res.data, { status: 200 })
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "An error occurred while creating the user." }, { status: 500 });
    }
}