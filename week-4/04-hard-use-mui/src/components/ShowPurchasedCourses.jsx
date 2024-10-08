import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card} from "@mui/material";

function ShowPurchasedCourses() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/users/purchasedCourses",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            .then((res) => {
                setCourses(res.data.purchasedCourses);
            }).catch((err) => {
                console.log(err);
                setError(err)
        })
    }, [])
    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: 'blue',
                color: "white"
            }}>
                <h1 style={{margin: "10px"}}>Purchased Courses</h1>

            </div>

            {error && <p style={{color: 'red', margin: "auto"}}>{error}</p>}

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
                            <Button variant="contained" color="primary">
                                Purchased
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

export default ShowPurchasedCourses;