import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async (username, password) => {
        const success = handleInputErrors(username, password);
        if (!success) return;
        setLoading(true);

        try {
            const res = await fetch("https://chat-apps-gf9k.vercel.app/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to log in");
            }

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            // Store the token in localStorage
            localStorage.setItem("token", data.token); // Ensure this is where your token is

            // Optional: Set user data in context if needed
            setAuthUser(data);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;

function handleInputErrors(username, password) {
    if (!username || !password) {
        toast.error("Please fill in all fields");
        return false;
    }
    return true;
}
