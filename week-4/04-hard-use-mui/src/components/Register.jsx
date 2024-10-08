import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"; // Correct import
import axios from "axios";
import {Button, TextField} from "@mui/material";

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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <h1 style={{margin: " 10px auto"}}>Register to the website</h1>
            {error && <p style={{ color: 'red', margin: "auto" }} >{error}</p>}
            <form onSubmit={register} style={{ margin: "10px auto" }}>
                <TextField id="outlined-basic" label="Username *" variant="outlined" value={username} onChange={e => setUsername(e.target.value)} style={{ margin: "10px auto", width: "300px" }} /><br/>
                <TextField id="outlined-basic" label="Email *" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} style={{ margin: "10px auto", width: "300px" }} /><br/>
                <TextField type="password" id="outlined-basic" label="Password *" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} style={{ margin: "10px auto", width: "300px" }}/><br/>
                <Button variant="contained" type="submit" style={{ margin: "10px 6.1rem" }}>Register</Button>
            </form>
            <br />
            <div style={{ margin: "auto" }}>
                Already a user? <Link to="/login">Login</Link>
            </div>

        </div>
    );
}

export default Register;
