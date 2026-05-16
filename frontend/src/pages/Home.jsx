// frontend/src/pages/Home.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Navbar from "../components/Navbar";

function Home() {

    const navigate = useNavigate();

    const [events, setEvents] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem('token');

        if (!token) {

            navigate('/');

        }

        axios.get('http://127.0.0.1:8000/api/events/')

        .then(response => {

            setEvents(response.data);

        })

        .catch(error => {

            console.log(error);

        });

    }, []);

    const checkIn = (eventId) => {

        axios.post('http://127.0.0.1:8000/api/attendance/', {

            user: 1,
            event: eventId,
            checked_in: true

        })

        .then(response => {

            alert('Attendance Recorded');

        })

        .catch(error => {

            console.log(error);

            alert('Check In Failed');

        });

    };

    return (

        <div style={styles.container}>

            <Navbar />

            <div style={styles.content}>

                <h1>Available Events</h1>

                {
                    events.map(event => (

                        <div key={event.id} style={styles.card}>

                            <h2>{event.title}</h2>

                            <p>{event.description}</p>

                            <p>
                                <b>Location:</b> {event.location}
                            </p>

                            <button
                                style={styles.button}
                                onClick={() => checkIn(event.id)}
                            >
                                Check In
                            </button>

                        </div>

                    ))
                }

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

    card: {
        backgroundColor: 'white',
        padding: '25px',
        marginBottom: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    },

    button: {
        padding: '10px 20px',
        backgroundColor: '#2563EB',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }

};

export default Home;