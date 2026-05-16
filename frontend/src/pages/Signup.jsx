import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [re_password, setRePassword] = useState('');

    const handleSignup = () => {

        axios.post('http://127.0.0.1:8000/auth/users/', {

            username,
            email,
            password,
            re_password

        })

        .then(response => {

            alert('Account Created Successfully');

            navigate('/');

        })

        .catch(error => {

            console.log(error.response.data);

            alert('Signup Failed');

        });

    };

    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <h1>Student Sign Up</h1>

                <input
                    type="text"
                    placeholder="Username"
                    style={styles.input}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    style={styles.input}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    style={styles.input}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    style={styles.input}
                    onChange={(e) => setRePassword(e.target.value)}
                />

                <button style={styles.button} onClick={handleSignup}>
                    Sign Up
                </button>

                <p>
                    Already have an account? <Link to="/">Login</Link>
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
        backgroundColor: '#16A34A',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
    }

};

export default Signup;