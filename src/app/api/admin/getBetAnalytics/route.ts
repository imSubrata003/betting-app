import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { bajiId } = await req.json();

    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/bet/betanalytics`, {
            bajiId,
        });

        //console.log(res.data);
        return NextResponse.json(res.data);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
};
