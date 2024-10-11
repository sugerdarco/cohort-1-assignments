import { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';

interface SignupResponse {
    token?: string;
    message?: string;
}

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {

        try {
            const response = await fetch('http://localhost:3000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data: SignupResponse = await response.json();
            if (response.ok && data.token) {
                localStorage.setItem("token", data.token)
                navigate("/todos");
            } else {
                alert(data.message || 'Signup failed');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div style={{justifyContent: "center", display: "flex", width: "100%"}}>
            <div>
                <h2>Signup</h2>
                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' /><br/>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' /><br/>
                <button onClick={handleSignup}>Signup</button><br/><br/>
                Already signed up? <Link to="/login">Login</Link>
            </div>
        </div>
    );
};

export default Signup;
