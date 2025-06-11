import axios from "axios";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const { id, status } = await req.json();
    //console.log('id and status : ', id, status);
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/updateuserstatus`, {
        id, status
    });

    //console.log(res.data);
    return new Response(JSON.stringify(res.data), { status: 200 });
};
