import { useState } from "react";
import axios from "axios";

function CreateCourse() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const createCourse = (e) => {
        e.preventDefault();

        if (!title || !description || !thumbnail) {
            setMessage("Please fill out all fields.");
            return;
        }

        axios.post("http://localhost:3000/admin/courses",
            {
                title: title,
                description: description,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setMessage("Course created successfully!");

                    setTitle("");
                    setDescription("");
                    setThumbnail(null);
                }
            })
            .catch((error) => {
                setMessage("Error creating course. Please try again.");
                console.error("Error creating course:", error);
            });
    };

    return (
        <div>
            <h1>Create Course</h1>
            <form onSubmit={createCourse}>
                Title: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /><br/>
                Description: <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} /><br/>
                Thumbnail: <input type="file" onChange={handleFileChange} /><br/>
                <button type="submit">Create Course</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default CreateCourse;
