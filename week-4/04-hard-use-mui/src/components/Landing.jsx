import {Link} from "react-router-dom";
import {Button} from "@mui/material";

function Landing() {
    return <div style={{display: "flex", flexDirection: "column", alignItems: "center", margin: "auto"}}>
        <h1>Welcome to course selling website!</h1>
        <div style={{margin: "10px 20px" }}>
            <Button variant="contained"><Link to={"/register"} style={{color: "white"}}>Register</Link></Button>
            <Button variant="contained"><Link to="/login" style={{color: "white"}}>Login</Link></Button>
        </div>
    </div>
}

export default Landing;