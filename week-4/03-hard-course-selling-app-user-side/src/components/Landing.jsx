import {Link} from "react-router-dom";

function Landing() {
    return <div>
        <h1>Welcome to course selling website!</h1>
        <Link to={"/register"}>Register</Link>
        <br/>
        <Link to="/login">Login</Link>
    </div>
}

export default Landing;