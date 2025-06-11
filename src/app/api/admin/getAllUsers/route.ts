import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/getallusers`);

        if (!response.data) {
            throw new Error("Failed to fetch users");
        }
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
};
