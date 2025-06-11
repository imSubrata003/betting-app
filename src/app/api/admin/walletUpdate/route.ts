import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { number, balance, type } = await req.json();

    console.log(number, balance, type);

    //console.log(`${process.env.NEXT_PUBLIC_BASE_URL}`);

    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/userwalletupdate`, {
      number,
      balance,
      type
    });

    //console.log(res.data);
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Wallet update failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
};
