import axios from 'axios'

export const POST = async (req: Request) => {
  try {
    const { bajiName, gameId, startTime, endTime, singlePrice, jodiPrice, pattiPrice } = await req.json()


    if (!bajiName || !gameId || !startTime || !endTime || !singlePrice || !jodiPrice || !pattiPrice) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 })
    }

    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/game/createbaji`, {
      bajiName,
      gameId,
      startTime,
      endTime,
      singlePrice,
      jodiPrice,
      pattiPrice,
    })

    if (res.status !== 201) {
      return new Response(JSON.stringify({ error: 'Failed to create baji' }), {
        status: res.status
      })
    }

    return new Response(JSON.stringify(res.data), { status: 201 })
  } catch (error: any) {
    console.error('Error in POST /addBaji route:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
