import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import AdminNavbar from "../components/AdminNavbar";

function AdminDashboard() {

    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');

    const [search, setSearch] = useState('');

    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem('admin_token');


    useEffect(() => {

        if (!token) {
            navigate('/admin/login');
            return;
        }

        fetchEvents();
        fetchAttendance();

    }, [navigate]);

    const fetchEvents = () => {
        axios.get('http://127.0.0.1:8000/api/events/', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setEvents(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    };

    const fetchAttendance = () => {
        axios.get('http://127.0.0.1:8000/api/attendance/', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setAttendance(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    };

    const createEvent = () => {

        if (editingId) {

            axios.put(`http://127.0.0.1:8000/api/events/${editingId}/`, {

                title,
                description,
                date,
                location
            }, {
                headers: { Authorization: `Bearer ${token}` }

            })

            .then(response => {

                alert('Event Updated');

                fetchEvents();

                setEditingId(null);

                setTitle('');
                setDescription('');
                setDate('');
                setLocation('');

            })

            .catch(error => {

                console.log(error);

            });

        } else {

            axios.post('http://127.0.0.1:8000/api/events/', {

                title,
                description,
                date,
                location
            }, {
                headers: { Authorization: `Bearer ${token}` }

            })

            .then(response => {

                alert('Event Created');

                fetchEvents();

                setTitle('');
                setDescription('');
                setDate('');
                setLocation('');

            })

            .catch(error => {

                console.log(error);

            });

        }

    };

    const deleteEvent = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/events/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            alert('Event Deleted');
            fetchEvents();
        })
        .catch(error => {
            console.log(error);
        });
    };

    const editEvent = (event) => {

        setEditingId(event.id);

        setTitle(event.title);
        setDescription(event.description);
        setDate(event.date);
        setLocation(event.location);

    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div style={styles.container}>

            <AdminNavbar />

            <div style={styles.content}>

                <h1>Admin Dashboard</h1>

                <div style={styles.statsContainer}>

                    <div style={styles.statsCard}>
                        <h2>{events.length}</h2>
                        <p>Total Events</p>
                    </div>

                    <div style={styles.statsCard}>
                        <h2>{attendance.length}</h2>
                        <p>Total Attendance</p>
                    </div>

                </div>

                <div style={styles.formCard}>

                    <h2>{editingId ? '✏️ Editing Event' : 'Create Event'}</h2>
                    {editingId && (
                        <div style={{
                            backgroundColor: '#FEF3C7',
                            border: '2px solid #F59E0B',
                            padding: '10px 15px',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ color: '#92400E', fontWeight: 'bold' }}>
                                Editing: {title}
                            </span>
                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setTitle('');
                                    setDescription('');
                                    setDate('');
                                    setLocation('');
                                }}
                                style={{
                                    backgroundColor: '#DC2626',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Cancel Edit
                            </button>
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="Event Title"
                        style={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        placeholder="Description"
                        style={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="datetime-local"
                        style={styles.input}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Location"
                        style={styles.input}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <button style={styles.createBtn} onClick={createEvent}>
                        {editingId ? 'Update Event' : 'Create Event'}
                    </button>

                </div>

                <div style={styles.formCard}>

                    <h2>Search Events</h2>

                    <input
                        type="text"
                        placeholder="Search Event..."
                        style={styles.input}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <div>

                    <h2>All Events</h2>

                    {
                        filteredEvents.map(event => (

                            <div key={event.id} style={styles.eventCard}>

                                <h3>{event.title}</h3>

                                <p>{event.description}</p>

                                <p>
                                    <b>Location:</b> {event.location}
                                </p>

                                <button
                                    style={styles.deleteBtn}
                                    onClick={() => deleteEvent(event.id)}
                                >
                                    Delete
                                </button>

                                <button
                                    style={styles.editBtn}
                                    onClick={() => editEvent(event)}
                                >
                                    Edit
                                </button>

                            </div>

                        ))
                    }

                </div>

                <div style={styles.formCard}>

                    <h2>Attendance Records</h2>

                    {
                        attendance.map(record => (

                            <div key={record.id} style={styles.eventCard}>

                                <p>
                                    <b>Student:</b> {record.username}
                                </p>

                                <p>
                                    <b>Event:</b> {record.event_title}
                                </p>

                                <p>
                                    <b>Status:</b> Present
                                </p>

                            </div>

                        ))
                    }

                </div>

            </div>

        </div>

    );

}

const styles = {

    container: {
        backgroundColor: '#F1F5F9',
        minHeight: '100vh'
    },

    content: {
        padding: '30px'
    },

    statsContainer: {
        display: 'flex',
        gap: '20px',
        marginBottom: '30px'
    },

    statsCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '200px',
        textAlign: 'center'
    },

    formCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px'
    },

    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px'
    },

    textarea: {
        width: '100%',
        padding: '12px',
        height: '100px',
        marginBottom: '15px'
    },

    createBtn: {
        padding: '12px 20px',
        backgroundColor: '#16A34A',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
    },

    eventCard: {
        backgroundColor: 'white',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '10px'
    },

    deleteBtn: {
        padding: '10px 15px',
        backgroundColor: '#DC2626',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
    },

    editBtn: {
        padding: '10px 15px',
        backgroundColor: '#2563EB',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '10px'
    }

};

export default AdminDashboard;