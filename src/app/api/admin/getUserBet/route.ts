import axios from "axios";

export async function POST(request: Request) {
    const { userId } = await request.json();  
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bet/getuserbets`,{
            userId
        }
    );
    // console.log('res', res.data);

    return new Response(JSON.stringify(res.data), {
        headers: { 'Content-Type': 'application/json' },
    });
}
