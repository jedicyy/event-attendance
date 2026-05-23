import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>

    <HashRouter>

      <App />

    </HashRouter>

  </React.StrictMode>,
)

// Set axios default Authorization header from localStorage token (if present)
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}