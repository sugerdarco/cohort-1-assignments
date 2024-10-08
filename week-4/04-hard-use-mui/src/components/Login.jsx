import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {Button} from "@mui/material";
import {TextField} from "@mui/material";


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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <h1 style={{margin: " 10px auto"}}>Login to admin dashboard</h1>
            {error && <p style={{ color: 'red', margin: "auto" }}>{error}</p>}
            <form onSubmit={login} style={{ margin: "10px auto" }}>
                <TextField id="outlined-basic" label="Username *" variant="outlined" value={username} onChange={e => setUsername(e.target.value)} style={{ margin: "10px auto", width: "300px" }} /><br/>
                <TextField type="password" id="outlined-basic" label="Password *" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} style={{ margin: "10px auto", width: "300px" }}/><br/>
                <Button variant="contained" type="submit" style={{ margin: "10px 6.1rem" }}>Login</Button>
        </form>
            <br />
            <div style={{margin: "auto"}}>
                New here? <Link to="/register" style={{margin: "auto"}}>Register</Link>
            </div>

        </div>
    );
}

export default Login;