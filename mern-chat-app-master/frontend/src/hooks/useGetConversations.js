import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const { setConversations } = useConversation(); // Ensure you're importing this correctly

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token"); // Retrieve the token
                const res = await fetch("https://chat-apps-gf9k.vercel.app/api/users", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // Include the token
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || "Failed to fetch conversations");
                }

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

        getConversations();
    }, [setConversations]); // Make sure to include dependencies

    return { loading };
};

export default useGetConversations;
