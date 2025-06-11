import axios from 'axios'

export const POST = async (req: Request) => {
    try {
        const body = await req.json(); 
        const { phone, pass, name } = body;

        //console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/user/signup`);

        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/signup`, {
            phone,
            pass,
            name
        });

        return new Response(JSON.stringify(res.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        console.error('Signup error:', error?.response?.data || error.message);

        return new Response(
            JSON.stringify({ message: 'Signup failed', error: error.message }),
            { status: 500 }
        );
    }
};
