import axios from "axios";

export const POST = async (req: Request) => {
    const { name, image } = await req.json()
    //console.log(name, image);
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/game/creategames`, {
            name, image
        });

        if (res.status !== 201) {
            return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: res.status });
        }

        //console.log("Game created successfully:", res.data);
        return new Response(JSON.stringify('added image and text', res.data), { status: res.status });
    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
