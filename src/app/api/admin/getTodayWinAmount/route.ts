import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/gettodaywin`)
    //console.log(res.data);

    return NextResponse.json(res.data)
}