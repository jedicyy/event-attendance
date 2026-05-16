import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {

        axios.post('http://127.0.0.1:8000/auth/jwt/create/', {
            username,
            password
        })

        .then(response => {

            localStorage.setItem('token', response.data.access);

            alert('Login Successful');

            navigate('/home');

        })

        .catch(error => {

            console.log(error);

            alert('Invalid Credentials');

        });

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