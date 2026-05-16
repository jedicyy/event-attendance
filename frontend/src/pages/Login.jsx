import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {

        try {

            const response = await axios.post(
                'http://127.0.0.1:8000/api/auth/jwt/create/',
                {
                    username,
                    password
                }
            );

            // SAVE JWT TOKEN
            const token = response.data.access;

            localStorage.setItem("token", token);

            // GET CURRENT USER INFO
            const userResponse = await axios.get(
                'http://127.0.0.1:8000/api/me/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // SAVE ROLE
            localStorage.setItem("role", userResponse.data.role);

            alert('Login successful');

            // REDIRECT BASED ON ROLE
            if (userResponse.data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }

        } catch (error) {

            console.log(error);

            alert('Invalid Credentials');

        }

    };

    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <h1>Student Login</h1>

                <input
                    type="text"
                    placeholder="Username"
                    style={styles.input}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    style={styles.input}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button style={styles.button} onClick={handleLogin}>
                    Login
                </button>

                <p>
                    No account? <Link to="/signup">Sign Up</Link>
                </p>

            </div>

        </div>

    );

}

const styles = {

    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0F172A'
    },

    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        width: '350px',
        textAlign: 'center'
    },

    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px'
    },

    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2563EB',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
    }

};

export default Login;