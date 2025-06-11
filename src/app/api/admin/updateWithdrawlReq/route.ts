import axios from "axios";

export const POST = async (req: Request) => {
    try {
        const { withdrawId, status } = await req.json();

        if (!withdrawId || !status) {
            return new Response(JSON.stringify({ error: "Insufficient data" }), { status: 400 });
        }

        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/transaction/updatewithdrawrequest`, {
            withdrawId, status
        });

        if (res.status !== 200) {
            return new Response(JSON.stringify({ error: "Failed to update withdraw request" }), { status: res.status });
        }

        //console.log('Withdraw update response:', res.data);
        return new Response(JSON.stringify(res.data), { status: 200 });

    } catch (error) {
        console.error("Error in updateWithdrawStatus API:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
