import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { name, phone, password } = await req.json();
    //console.log(name, phone, password);
    
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/createuser`, {
            name, phone, password
        });
        // console.log(res.data);
        
        // Corrected response return
        return NextResponse.json(res.data, { status: 200 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "An error occurred while creating the user." }, { status: 500 });
    }
};
