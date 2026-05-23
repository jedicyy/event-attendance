import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ActivateAccount = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Activating your account...");

    useEffect(() => {
        if (!uid || !token) {
            setStatus("Invalid activation link.");
            return;
        }

        console.log("Activating with:", { uid, token }); // Check these values

        axios.post("http://192.168.100.14:8000/api/auth/users/activation/", { uid, token })
            .then((response) => {
                console.log("Success:", response.data);
                setStatus("Account activated! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            })
            .catch((error) => {
                const errData = error.response?.data;
                console.error("Error:", errData);

                // Djoser returns specific error keys
                if (errData?.token) {
                    setStatus(`Token error: ${errData.token}`);
                } else if (errData?.uid) {
                    setStatus(`UID error: ${errData.uid}`);
                } else if (errData?.detail) {
                    setStatus(`Error: ${errData.detail}`);
                } else {
                    setStatus(`Activation failed: ${JSON.stringify(errData)}`);
                }
            });
    }, [uid, token, navigate]);

    return (
        <div>
            <h1>{status}</h1>
        </div>
    );
};

export default ActivateAccount;