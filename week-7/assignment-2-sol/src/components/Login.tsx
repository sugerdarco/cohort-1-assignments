import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';

interface LoginResponse {
    token?: string;
    message?: string;
}

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data: LoginResponse = await response.json();
            if (response.ok && data.token) {
                localStorage.setItem("token", data.token);
                navigate("/todos");
            } else {
                alert(data.message || "Invalid credentials");
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div style={{justifyContent: "center", display: "flex", width: "100%"}}>
            <div>
                <h2>Login</h2>
                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' /><br/>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' /><br/>
                <button onClick={handleLogin}>Login</button><br/><br/>
                New here? <Link to="/signup">Signup</Link>
            </div>
        </div>
    );
};

export default Login;
