import axios from "axios"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
  try {
    const { bajiId, name, gameId, startTime, endTime, singlePrice, jodiPrice, pattiPrice } = await req.json()
    console.log("Received data:", {
      bajiId,
      name, gameId,
      startTime,
      endTime,
      singlePrice,
      jodiPrice,
      pattiPrice
    });

    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/game/editbaji`, {
      bajiId,
      name,
      gameId,
      startTime,
      endTime,
      singlePrice,
      jodiPrice,
      pattiPrice
    })

    //console.log(res.data)
    return NextResponse.json(res.data)
  } catch (error: any) {
    console.error("Error editing baji:", error.response?.data || error.message)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
