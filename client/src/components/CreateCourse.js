import { useState, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserContext from "../context/UserContext";
import { api } from "../utils/apiHelper";
import ValidationErrors from "./ValidationErrors";

// Function to Create Course
const CreateCourse = () => {
    const { authUser } = useContext(UserContext);
    const navigate = useNavigate();
    const courseTitle = useRef(null);
    const courseDescription = useRef(null);
    const estimatedTime = useRef(null);
    const materialsNeeded = useRef(null);
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submitted!");
        // New course values
        const newCourse = {
            userId: authUser.id,
            title: courseTitle.current.value,
            description: courseDescription.current.value,
            estimatedTime: estimatedTime.current.value,
            materialsNeeded: materialsNeeded.current.value
        };

    try {
            const response = await api("/courses", "POST", newCourse, authUser);
            console.log(response);
            if (response.status === 201) {
                navigate("/");
            } else if (response.status === 500) {
                navigate("/error");
            } else if (response.status === 404) {
                navigate("/notfound");
            } else if (response.status === 400) {
                const data = await response.json();
                setErrors(data.errors);
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log(error);
            navigate("/error");
        }
    };
    // Routes back to home route when cancel is selected
    const handleCancel = (event) => {
        event.preventDefault();
        navigate("/");
    };

    return (
        <main>
            <div className="wrap">
                <h2>Create Course</h2>
                <ValidationErrors errors={errors} />
                <form onSubmit={handleSubmit}>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="courseTitle">Course Title</label>
                            <input id="courseTitle" name="courseTitle" type="text" ref={courseTitle} />

                            <p>
                                By {authUser.firstName} {authUser.lastName}
                            </p>

                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea
                                id="courseDescription"
                                name="courseDescription"
                                ref={courseDescription}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input id="estimatedTime" name="estimatedTime" type="text" ref={estimatedTime} />

                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea id="materialsNeeded" name="materialsNeeded" ref={materialsNeeded}></textarea>
                        </div>
                    </div>
                    <button className="button" type="submit">
                        Create Course
                    </button>
                    <button className="button button-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                </form>
            </div>
        </main>
    );
};

export default CreateCourse;
