import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/bet/todaybetamount`)
    //console.log(res.data);
    return NextResponse.json(res.data)
}