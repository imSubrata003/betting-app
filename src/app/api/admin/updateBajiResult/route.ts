import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { bajiId, gameId, singleResult, pattiResult } = await req.json();

    //console.log(bajiId, gameId, singleResult, pattiResult);

    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/game/updatebajiresult`, {
        bajiId,
        gameId,
        singleResult,
        pattiResult,
    });
    
    //console.log(res.data);
    return NextResponse.json(res.data);
}
