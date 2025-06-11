// app/api/gamesetting/edit/route.ts

import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { id, data } = body;

    // Ensure all fields are properly formatted and passed explicitly
    const payload = {
      id,
      withdrawal: String(data.withdrawal || ""),
      // startTime: String(data.startTime || ""),
      // endTime: String(data.endTime || ""),
      // prizeMoney: String(data.prizeMoney || ""),
      withdrawalLimit: String(data.withdrawalLimit || ""),
      minimumWithdrawalAmount: String(data.minimumWithdrawalAmount || ""),
      minimumDepositAmount: String(data.minimumDepositAmount || ""),
      maximumSingleBiddingNumber: String(data.maximumSingleBiddingNumber || ""),
      maximumSingleBiddingAmount: String(data.maximumSingleBiddingAmount || ""),
      minimumSingleBiddingAmount: String(data.minimumSingleBiddingAmount || ""),
      maximumJodiBiddingNumber: String(data.maximumJodiBiddingNumber || ""),
      maximumJodiBiddingAmount: String(data.maximumJodiBiddingAmount || ""),
      minimumJodiBiddingAmount: String(data.minimumJodiBiddingAmount || ""),
      maximumPattiBiddingNumber: String(data.maximumPattiBiddingNumber || ""),
      maximumPattiBiddingAmount: String(data.maximumPattiBiddingAmount || ""),
      minimumPattiBiddingAmount: String(data.minimumPattiBiddingAmount || ""),
    };

    //console.log("Sending payload:", payload);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/gamesetting/editgamesettings`,
      payload
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Error in editgamesettings POST:", error?.response?.data || error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
