import axios from "axios";

export const GET = async (req: Request) => {
    try {
        const res =  await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/transaction/getwithdrawrequests`);

        // //console.log('wit res', res);

        if (res.status !== 200) {
            return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: res.status });
        }
        // if (res.data.length === 0) {
        //     return new Response(JSON.stringify({ error: "No data found" }));
        // }
        //console.log('get withdrawl response : ', res.data);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}