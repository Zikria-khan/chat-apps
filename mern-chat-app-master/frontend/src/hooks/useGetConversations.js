import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem("token"); // Retrieve the token
        const res = await fetch("https://chat-apps-qbkv.vercel.app/api/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Include the token
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
        if (data.error) {
            throw new Error(data.error);
        }
        setConversations(data);
    } catch (error) {
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
};
export default useGetConversations;
