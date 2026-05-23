import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required');
            return false;
        }

        if (formData.username.length < 3) {
            setError('Username must be at least 3 characters');
            return false;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSignup = async () => {
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/users/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                re_password: formData.confirmPassword
            });

            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.log(error);
            if (error.response?.data) {
                const errorMessages = Object.entries(error.response.data)
                    .map(([key, value]) => {
                        const msg = Array.isArray(value) ? value[0] : value;
                        return `${key}: ${msg}`;
                    })
                    .join('\n');
                setError(errorMessages);
            } else {
                setError('Sign up failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    };

    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <h1 style={styles.title}>Create Account</h1>
                <p style={styles.subtitle}>Join our event attendance system</p>

                {error && (
                    <div style={styles.errorBox}>
                        {error.split('\n').map((msg, idx) => (
                            <div key={idx}>{msg}</div>
                        ))}
                    </div>
                )}

                {success && (
                    <div style={styles.successBox}>
                        {success}
                    </div>
                )}

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    style={styles.input}
                    value={formData.username}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    style={styles.input}
                    value={formData.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password (min 8 characters)"
                    style={styles.input}
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    style={styles.input}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />

                <button
                    style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
                    onClick={handleSignup}
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>

                <p style={styles.linkText}>
                    Already have an account? <Link to="/login" style={styles.link}>Login</Link>
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
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        padding: '20px'
    },

    card: {
        backgroundColor: '#1e293b',
        padding: '40px',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        border: '2px solid #22c55e',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
    },

    title: {
        color: '#22c55e',
        marginBottom: '5px',
        fontSize: '28px'
    },

    subtitle: {
        color: '#94a3b8',
        marginBottom: '25px',
        fontSize: '14px'
    },

    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        backgroundColor: '#0f172a',
        border: '2px solid #334155',
        color: 'white',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s ease'
    },

    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#22c55e',
        color: '#0f172a',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px',
        transition: 'background-color 0.3s ease'
    },

    linkText: {
        color: '#94a3b8',
        marginTop: '20px',
        fontSize: '14px'
    },

    link: {
        color: '#22c55e',
        textDecoration: 'none',
        fontWeight: 'bold',
        cursor: 'pointer'
    },

    errorBox: {
        backgroundColor: '#7f1d1d',
        color: '#fca5a5',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '13px',
        border: '2px solid #dc2626',
        textAlign: 'left'
    },

    successBox: {
        backgroundColor: '#166534',
        color: '#86efac',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '13px',
        border: '2px solid #22c55e',
        textAlign: 'center'
    }

};

export default Signup;
