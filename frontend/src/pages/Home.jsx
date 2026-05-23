import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/');

        // Fetch events
        axios.get('http://127.0.0.1:8000/api/events/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setEvents(response.data))
            .catch(error => console.log(error));

        // Fetch user info
        axios.get('http://127.0.0.1:8000/api/me/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setUserInfo(response.data))
            .catch(error => console.log(error));

        // Fetch attendance history
        axios.get('http://127.0.0.1:8000/api/attendance/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setAttendance(response.data))
            .catch(error => console.log(error));

    }, []);

    const checkIn = (eventId) => {
        axios.post('http://127.0.0.1:8000/api/attendance/', {
            event: eventId,
            checked_in: true
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                alert('Attendance Recorded');
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
                alert('Check In Failed');
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    const activeEvents = events.filter(event => new Date(event.date) >= new Date());

    return (
        <div style={styles.pageContainer}>
            {/* Sidebar */}
            <div style={{ ...styles.sidebar, left: sidebarOpen ? 0 : '-280px' }}>
                <div style={styles.sidebarHeader}>
                    <h2>Event System</h2>
                    <button
                        style={styles.toggleBtn}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        ☰
                    </button>
                </div>

                {/* Profile Section */}
                <div style={styles.profileSection}>
                    <div style={styles.profileAvatar}>{userInfo.username?.[0]?.toUpperCase()}</div>
                    <h3>{userInfo.username}</h3>
                    <p>{userInfo.email}</p>
                </div>

                {/* Menu */}
                <div style={styles.menuSection}>
                    <button
                        style={{
                            ...styles.menuItem,
                            backgroundColor: activeTab === 'dashboard' ? '#22c55e' : 'transparent'
                        }}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        📊 Dashboard
                    </button>
                    <button
                        style={{
                            ...styles.menuItem,
                            backgroundColor: activeTab === 'events' ? '#22c55e' : 'transparent'
                        }}
                        onClick={() => setActiveTab('events')}
                    >
                        📅 Events
                    </button>
                    <button
                        style={{
                            ...styles.menuItem,
                            backgroundColor: activeTab === 'history' ? '#22c55e' : 'transparent'
                        }}
                        onClick={() => setActiveTab('history')}
                    >
                        📋 History
                    </button>
                </div>

                <button style={styles.logoutBtn} onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>

            {/* Main Content */}
            <div style={styles.mainContent}>
                <div style={styles.topBar}>
                    <h1>Event Attendance System</h1>
                    <button
                        style={styles.toggleSidebarBtn}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        ☰
                    </button>
                </div>

                <div style={styles.contentArea}>
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div>
                            {/* Stats */}
                            <div style={styles.statsGrid}>
                                <div style={styles.statCard}>
                                    <div style={styles.statNumber}>{events.length}</div>
                                    <div style={styles.statLabel}>Total Events</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statNumber}>{activeEvents.length}</div>
                                    <div style={styles.statLabel}>Active Events</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statNumber}>{attendance.length}</div>
                                    <div style={styles.statLabel}>Check-ins</div>
                                </div>
                            </div>

                            {/* Active Events Section */}
                            <div style={styles.section}>
                                <h2 style={styles.sectionTitle}>🔴 Active Events</h2>
                                {activeEvents.length === 0 ? (
                                    <p style={styles.emptyMessage}>No active events at the moment</p>
                                ) : (
                                    <div style={styles.eventsGrid}>
                                        {activeEvents.map(event => (
                                            <div key={event.id} style={styles.eventCard}>
                                                <div style={styles.eventHeader}>
                                                    <h3>{event.title}</h3>
                                                    <span style={styles.eventBadge}>ACTIVE</span>
                                                </div>
                                                <p style={styles.eventDesc}>{event.description}</p>
                                                <div style={styles.eventDetails}>
                                                    <p>📍 {event.location}</p>
                                                    <p>🕐 {new Date(event.date).toLocaleDateString()}</p>
                                                </div>
                                                <button
                                                    style={styles.checkInBtn}
                                                    onClick={() => checkIn(event.id)}
                                                >
                                                    ✓ Check In
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Events Tab */}
                    {activeTab === 'events' && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>📅 All Events</h2>
                            {events.length === 0 ? (
                                <p style={styles.emptyMessage}>No events available</p>
                            ) : (
                                <div style={styles.eventsGrid}>
                                    {events.map(event => (
                                        <div key={event.id} style={styles.eventCard}>
                                            <div style={styles.eventHeader}>
                                                <h3>{event.title}</h3>
                                                <span style={{
                                                    ...styles.eventBadge,
                                                    backgroundColor: new Date(event.date) >= new Date() ? '#22c55e' : '#6b7280'
                                                }}>
                                                    {new Date(event.date) >= new Date() ? 'ACTIVE' : 'PAST'}
                                                </span>
                                            </div>
                                            <p style={styles.eventDesc}>{event.description}</p>
                                            <div style={styles.eventDetails}>
                                                <p>📍 {event.location}</p>
                                                <p>🕐 {new Date(event.date).toLocaleDateString()}</p>
                                            </div>
                                            {new Date(event.date) >= new Date() && (
                                                <button
                                                    style={styles.checkInBtn}
                                                    onClick={() => checkIn(event.id)}
                                                >
                                                    ✓ Check In
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>📋 Attendance History</h2>
                            {attendance.length === 0 ? (
                                <p style={styles.emptyMessage}>No attendance records yet</p>
                            ) : (
                                <div style={styles.historyList}>
                                    {attendance.map(record => (
                                        <div key={record.id} style={styles.historyItem}>
                                            <div style={styles.historyContent}>
                                                <h4>{record.event_title}</h4>
                                                <p>{record.event_description}</p>
                                            </div>
                                            <div style={styles.historyStatus}>
                                                <span style={styles.statusBadge}>✓ Present</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    pageContainer: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    },

    sidebar: {
        width: '280px',
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '20px',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
        transition: 'left 0.3s ease',
        zIndex: 1000
    },

    sidebarHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #22c55e',
        paddingBottom: '15px'
    },

    profileSection: {
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#0f172a',
        borderRadius: '10px',
        border: '2px solid #22c55e'
    },

    profileAvatar: {
        width: '60px',
        height: '60px',
        backgroundColor: '#22c55e',
        color: '#0f172a',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '0 auto 10px'
    },

    menuSection: {
        marginBottom: '30px'
    },

    menuItem: {
        width: '100%',
        padding: '12px 15px',
        marginBottom: '8px',
        backgroundColor: 'transparent',
        color: 'white',
        border: '2px solid #334155',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        textAlign: 'left'
    },

    logoutBtn: {
        width: '100%',
        padding: '12px 15px',
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        marginTop: '20px',
        transition: 'background-color 0.3s ease'
    },

    toggleBtn: {
        backgroundColor: 'transparent',
        color: '#22c55e',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer'
    },

    mainContent: {
        flex: 1,
        marginLeft: '280px',
        transition: 'margin-left 0.3s ease'
    },

    topBar: {
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #22c55e',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    },

    toggleSidebarBtn: {
        backgroundColor: '#22c55e',
        color: '#0f172a',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'none'
    },

    contentArea: {
        padding: '30px'
    },

    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
    },

    statCard: {
        backgroundColor: '#1e293b',
        padding: '25px',
        borderRadius: '10px',
        textAlign: 'center',
        border: '2px solid #22c55e',
        color: 'white'
    },

    statNumber: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#22c55e',
        marginBottom: '10px'
    },

    statLabel: {
        fontSize: '14px',
        color: '#94a3b8'
    },

    section: {
        marginBottom: '40px'
    },

    sectionTitle: {
        fontSize: '24px',
        color: '#22c55e',
        marginBottom: '20px',
        borderBottom: '2px solid #22c55e',
        paddingBottom: '10px'
    },

    eventsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
    },

    eventCard: {
        backgroundColor: '#1e293b',
        borderRadius: '10px',
        padding: '20px',
        border: '2px solid #334155',
        color: 'white',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
    },

    eventHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    },

    eventBadge: {
        backgroundColor: '#22c55e',
        color: '#0f172a',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
    },

    eventDesc: {
        color: '#cbd5e1',
        marginBottom: '15px',
        fontSize: '14px'
    },

    eventDetails: {
        color: '#94a3b8',
        fontSize: '13px',
        marginBottom: '15px'
    },

    checkInBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#22c55e',
        color: '#0f172a',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'background-color 0.3s ease'
    },

    emptyMessage: {
        color: '#94a3b8',
        textAlign: 'center',
        padding: '40px',
        fontSize: '16px'
    },

    historyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },

    historyItem: {
        backgroundColor: '#1e293b',
        padding: '20px',
        borderRadius: '10px',
        border: '2px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
    },

    historyContent: {
        flex: 1
    },

    historyStatus: {
        marginLeft: '20px'
    },

    statusBadge: {
        backgroundColor: '#22c55e',
        color: '#0f172a',
        padding: '6px 12px',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '13px'
    }
};

export default Home;