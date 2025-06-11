import axios from 'axios'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  try {
    const { gameId } = await req.json()
    // //console.log('Received gameId:', gameId)

    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/game/getbajis`, {
      gameId,
    })

    // //console.log('Fetched bajis:', res.data)
    return NextResponse.json(res.data, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching bajis:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
