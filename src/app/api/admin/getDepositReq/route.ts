import axios from "axios";

export const GET = async (req: Request) => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/transaction/getdepositrequests`);
        if (res.status !== 200) {
            return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: res.status });
        }
       

        //console.log("Deposit data fetched successfully:", res.data);
        return new Response(JSON.stringify(res.data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });

    }
}
