// frontend/src/pages/Navbar.js

import { useNavigate } from 'react-router-dom';

function Navbar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem('token');

        navigate('/');

    };

    return (

        <div style={styles.navbar}>

            <div>
                <h2 style={styles.logo}>Event Attendance System</h2>
            </div>

            <div>

                <button style={styles.button}>
                    Home
                </button>

                <button style={styles.logoutBtn} onClick={logout}>
                    Logout
                </button>

            </div>

        </div>

    );

}

const styles = {

    navbar: {
        backgroundColor: '#0F172A',
        color: 'white',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    logo: {
        margin: 0
    },

    button: {
        padding: '10px 15px',
        marginRight: '10px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#2563EB',
        color: 'white',
        borderRadius: '5px'
    },

    logoutBtn: {
        padding: '10px 15px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#DC2626',
        color: 'white',
        borderRadius: '5px'
    }

};

export default Navbar;