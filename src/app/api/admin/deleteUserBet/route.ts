import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing betId in request body" }), { status: 400 });
    }

    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/bet/deleteuserbet`, {
      id,
    });

    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error in delete user bet:', error);
    return new Response(JSON.stringify({ error: "Failed to delete bet" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
