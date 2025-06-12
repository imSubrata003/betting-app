'use client'

import axios from "axios";
import { toast } from "react-toastify";

export const validateUser = async () => {
    const stored = localStorage.getItem("userData");

    if (stored) {
        const user = JSON.parse(stored);
        const res = await axios.post("/api/user/login", {
            phone: user.phone,
            pass: user.password,
        });
        console.log("my dataaaaaaaaaaaaaaaa", res.data);


        if (res.data) {
            localStorage.setItem("userData", JSON.stringify(res.data));
            return res.data
        } else {
            toast.error("Oops! Invalid User, Please Login");
            localStorage.removeItem("userData");
        }
    }

};