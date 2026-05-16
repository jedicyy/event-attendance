import axios from "axios";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ActivateAccount = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.post(
            "http://127.0.0.1:8000/api/auth/users/activation/",
            {
                uid: uid,
                token: token,
            }
        )
        .then((response) => {
            console.log(response.data);
            alert("Account activated successfully!");
            navigate("/login");
        })
        .catch((error) => {
            console.log(error.response.data);
            alert(JSON.stringify(error.response.data));
        });
    }, [uid, token, navigate]);

    return <h1>Activating account...</h1>;
};

export default ActivateAccount;