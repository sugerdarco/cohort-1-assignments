import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"; // Correct import
import axios from "axios";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const register = (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            setError("All fields are required.");
            return;
        }

        setError(""); // Clear any previous errors

        axios.post("http://localhost:3000/users/signup",
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    username: username,
                    email: email,
                    password: password,
                }
            }).then(res => {
            if (res.status === 200) {
                console.log("Registration successful");
                navigate("/login")
            }
        }).catch(err => {
            console.error(err);
            if (err.response && err.response.status === 400) {
                setError("Registration failed. Please check your input.");
            } else {
                setError("An error occurred. Please try again.");
            }

            setPassword('');
        });
    }

    return (
        <div>
            <h1>Register to the website</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={register}>
                    Username: <input type="text" value={username} onChange={e => setUsername(e.target.value)} /><br/>
                    Email: <input type="text" value={email} onChange={e => setEmail(e.target.value)} /><br/>
                    Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
                <button type="submit">Register</button>
            </form>
            <br />
            Already a user? <Link to="/login">Login</Link>
        </div>
    );
}

export default Register;
