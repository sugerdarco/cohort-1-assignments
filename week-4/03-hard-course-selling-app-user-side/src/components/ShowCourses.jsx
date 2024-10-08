import { useEffect, useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

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
        <div>
            <Link to={"/courses/purchased"}>Purchased Courses</Link>
            <h1>Available Courses</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {purchaseSuccess && <p style={{ color: 'green' }}>{purchaseSuccess}</p>}

            {courses.length > 0 ? (
                courses.map((c) => (
                    <div key={c._id}>
                        <h2>{c.title}</h2>
                        <p>{c.description}</p>
                        <button onClick={() => purchaseCourse(c._id)}>Purchase</button>
                    </div>
                ))
            ) : (
                <p>No courses available.</p>
            )}
        </div>
    );
}

export default ShowCourses;
