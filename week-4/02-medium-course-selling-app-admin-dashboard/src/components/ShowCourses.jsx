import { useEffect, useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

function ShowCourses() {
    const [courses, setCourses] = useState([]);

    // Fetch courses when the component mounts
    useEffect(() => {
        axios.get("http://localhost:3000/admin/courses", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Retrieving token from localStorage
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    setCourses(res.data.courses);
                }
            })
            .catch((err) => {
                console.log("Error fetching courses:", err);
            });
    }, []);

    return (
        <div>
            <Link to={"/courses/new"}>Create a Course</Link>
            <h1>Available Courses</h1>
            {courses.length > 0 ? (
                courses.map((c, index) => <Course key={index} title={c.title} />)
            ) : (
                <p>No courses available.</p>
            )}
        </div>
    );
}

function Course(props) {
    return (
        <div>
            <h2>{props.title}</h2>
        </div>
    );
}

export default ShowCourses;
