import axios from "axios";

export const POST = async (req: Request) => {
    try {
        const { depositId, status } = await req.json();

        if (!depositId || !status) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        //console.log("Deposit ID:", depositId, "Status:", status);

        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/transaction/updatedepositrequest`, {
            depositId,
            status,
        });

        if (res.status !== 200) {
            return new Response(JSON.stringify({ error: "Failed to update data" }), { status: res.status });
        }

        return new Response(JSON.stringify(res.data), { status: 200 });

    } catch (error: any) {
        console.error("Error updating deposit request:", error.message);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
