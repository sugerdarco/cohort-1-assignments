import {useEffect, useState} from "react";
import axios from "axios";

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
    })
    return (
        <div>
            <h1>purchased Courses</h1>
            {error && <p style={{color: 'red'}}>{error}</p>}

            {courses.length > 0 ? (
                courses.map((c) => (
                    <div key={c._id}>
                        <h2>{c.title}</h2>
                        <p>{c.description}</p>
                    </div>
                ))
            ) : (
                <p>No courses available.</p>
            )}
        </div>
    );
}

export default ShowPurchasedCourses;