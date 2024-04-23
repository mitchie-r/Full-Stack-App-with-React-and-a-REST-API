import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { api } from '../utils/apiHelper';

// Function to get all courses
const Courses = () => {
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {

      try {
        const response = await api("/courses", "GET", null, null)
        if (response.status === 200) {
          const responseData = await response.json();
          setCourses(responseData);
        } else if (response.status === 500) {
          navigate("/error");
        } else if (response.status === 404) {
          navigate("/notfound");
        } else {
          throw new Error();
        }

      } catch (error) {
        console.log("Error fetching and parsing data", error);
        navigate("/error")
      }
    }

    fetchCourses();
  }, [navigate]);
  // Displays all courses
  return (
    <div className="wrap main--grid">
      <h2>Courses</h2>
        {courses.map((course) => (
          <Link className="course--module course--link" to={`/courses/${course.id}`} key={course.id}>
            <h2 className="course--label">Course</h2>
            <h3 className="course--title">{course.title}</h3>
          </Link>
        ))}
      <Link className="course--module course--add--module" to="/courses/create">
        <span className="course--add--title">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 13 13"
            className="add"
          >
            <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
          </svg>
          New Course
        </span>
      </Link>
    </div>
  );
}

export default Courses;