import { useNavigate } from 'react-router-dom';

function AdminNavbar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem('admin_token');

        navigate('/admin');

    };

    return (

        <div style={styles.navbar}>

            <h2>Admin Dashboard</h2>

            <button style={styles.button} onClick={logout}>
                Logout
            </button>

        </div>

    );

}

const styles = {

    navbar: {
        backgroundColor: '#0F172A',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between'
    },

    button: {
        padding: '10px 20px',
        backgroundColor: '#DC2626',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
    }

};

export default AdminNavbar;