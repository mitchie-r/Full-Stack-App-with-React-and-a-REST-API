import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Markdown from 'react-markdown';

import UserContext from '../context/UserContext';
import { api } from '../utils/apiHelper';

// Function to pull and display a specific course's detail
const CourseDetail = () => {
  const { authUser } = useContext(UserContext);
  const [course, setCourse] = useState([]);

  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log("Fetching Course");
        // Request course by id
        const response = await api(`/courses/${id}`, "GET", null, authUser);

        if (response.status === 200) {
          const data = await response.json();
          console.log('JSON Data:', data);
          setCourse(data);
        } else if (response.status === 500) {
          navigate("/error");
        } else if (response.status === 404) {
          navigate("/notfound");
        } else {
          throw new Error();
        }
      } catch (error) {
        console.log("Error fetching Course", error);
        navigate("/error");
      }
    };

    fetchCourse();
  }, [authUser, id, navigate]);

   // Handles course deletion
  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      const response = await api(`/courses/${id}`, "DELETE", null, authUser)
      if (response.status === 204) {
        navigate('/');
      } else if (response.status === 403) {
        navigate("/forbidden")
      } else if (response.status === 500) {
        navigate("/error");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log("Error when deleting course", error);
      navigate("/error");
    }
  };
  return (
    <main>
      <div className="actions--bar">
        <div className="wrap">
          {authUser && authUser.id === course.userId && (
            <>
              <Link className="button button-update" to={`/courses/${course.id}/update`}>
                Update Course
              </Link>
              <button className="button button-delete" onClick={handleDelete}>
                Delete Course
              </button>
            </>
          )}
        </div>
      </div>

      <div className="wrap">
        <h2>Course Detail</h2>
        <form>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Course</h3>
              <h4 className="course--name">{course.title}</h4>
              <p>By {course.user?.firstName} {course.user?.lastName}</p>
              <Markdown>{course.description}</Markdown>
            </div>
            <div>
              <h3 className="course--detail--title">Estimated Time</h3>
              <p>{course.estimatedTime}</p>

              <h3 className="course--detail--title">Materials Needed</h3>
              <ul className="course--detail--list">
                <Markdown>{course.materialsNeeded}</Markdown>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
export default CourseDetail;