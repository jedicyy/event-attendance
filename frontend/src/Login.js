axios.post('http://127.0.0.1:8000/auth/jwt/create/', {
    username: username,
    password: password
})
.then(response => {
    localStorage.setItem('token', response.data.access);
    localStorage.setItem("role", response.data.role)
});