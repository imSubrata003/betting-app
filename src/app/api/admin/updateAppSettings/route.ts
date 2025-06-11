// app/api/appsettings/edit/route.ts

import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { id, data } = body;

        // Sanitize and ensure all required fields are sent as strings
        const payload = {
            id,
            appWebsite: String(data.appWebsite || ""),
            contactNumber: String(data.contactNumber || ""),
            whatsappNumber: String(data.whatsappNumber || ""),
            contactEmail: String(data.contactEmail || ""),
            registrationBonus: String(data.registrationBonus || ""),
            RefferalBonus: String(data.RefferalBonus || ""),
            homeBannerImage1: String(data.homeBannerImage1 || ""),
            homeBannerImage2: String(data.homeBannerImage2 || ""),
            homeBannerImage3: String(data.homeBannerImage3 || ""),
            logo: String(data.logo || ""),
            gameRules: String(data.gameRules || ""),
            depositDetails: String(data.depositDetails || ""),
            withdrawalDetails: String(data.withdrawalDetails || ""),
            notice: String(data.notice || ""),
        };


        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/appsetting/editappsettings`,
            payload
        );

        return NextResponse.json(res.data);
    } catch (error: any) {
        console.error("Error in POST handler:", error?.response?.data || error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
