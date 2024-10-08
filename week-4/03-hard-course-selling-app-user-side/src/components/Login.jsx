import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault(); // Prevent form from submitting normally

        if (!username || !password) {
            setError("Email and password are required.");
            return;
        }

        setError("");
        axios.post(`http://localhost:3000/users/login`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    username: username,
                    password: password,
                },
            }
        )
            .then((res) => {
                if (res.status === 200) {
                    console.log("Login successful");
                    localStorage.setItem("token", res.data.token);
                    navigate("/courses")
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    setError("Invalid credentials");
                } else {
                    setError("An error occurred. Please try again.");
                }
            });
    };

    return (
        <div>
            <h1>Login to admin dashboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={login}>
                    Username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /><br/>
                    Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br/>
                <button type="submit">Login</button>
            </form>
            <br />
            New here? <a href="/register">Register</a>
        </div>
    );
}

export default Login;
