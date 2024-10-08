import { useEffect, useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {Button, Card} from "@mui/material";

function ShowCourses() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [purchaseSuccess, setPurchaseSuccess] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/users/courses", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    setCourses(res.data.courses);
                }
            })
            .catch((err) => {
                console.log("Error fetching courses:", err);
                setError("Failed to fetch courses. Please try again.");
            });
    }, []);

    const purchaseCourse = (id) => {
        setPurchaseSuccess(null);
        setError(null);
        axios.post(`http://localhost:3000/users/courses/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }
        )
            .then((res) => {
                if (res.status === 200) {
                    setPurchaseSuccess(`${res.data.message}: ${id}`);
                }
            })
            .catch((err) => {
                console.log("Error purchasing course:", err);
                setError("Failed to purchase the course. Please try again.");
            });
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: 'blue',
                color: "white"
            }}>
                <h1 style={{margin: "10px"}}>Available Courses</h1>
                <Button variant="text" style={{margin: "10px"}}><Link to={"/courses/purchased"} style={{textDecoration: "none", color: "white"}}>Purchased
                    Courses</Link></Button>
            </div>

            {error && <p style={{ color: 'red', margin: "auto" }}>{error}</p>}
            {purchaseSuccess && <p style={{ color: 'green', margin: "auto" }}>{purchaseSuccess}</p>}

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '20px',
                padding: '20px',
            }}>
                {courses.length > 0 ? (
                    courses.map((c) => (
                        <Card key={c._id} variant="outlined" style={{
                            flexBasis: '20%',
                            marginBottom: '20px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <h2>{c.title}</h2>
                                <p>{c.description}</p>
                            </div>
                            <Button variant="contained" color="primary" onClick={() => purchaseCourse(c._id)}>
                                Purchase
                            </Button>
                        </Card>
                    ))
                ) : (
                    <p>No courses available.</p>
                )}
            </div>
        </div>
    );
}

export default ShowCourses;
