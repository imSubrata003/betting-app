import axios from "axios";

export const POST = async (req: Request) => {
    try {
        const body = await req.json(); 
        const { phone, pass } = body;       
        
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/login`, {
            phone,
            pass
        });

        //console.log("Login response:", res.data);

        return new Response(JSON.stringify(res.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error("Login error:", error?.response?.data || error.message);

        return new Response(JSON.stringify({
            message: 'Login failed',
            error: error.message
        }), { status: 500 });
    }
};
