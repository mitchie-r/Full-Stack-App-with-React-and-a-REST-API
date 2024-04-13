import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
/* import ReactMarkdown from 'react-markdown'; */
import UserContext from "../context/UserContext"

function CourseDetail({ context }) {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams(); 
  //const {authUser } = useContext(UserContext);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
          console.log("Fetching Course");
          const response = await fetch("http://localhost:5000/api/courses/" + id);
          console.log('Initial response:', response); // Inspect the full response object 
          console.log(response.status);
  
          if (response.status === 200) {
              const data = await response.json();
              console.log('JSON Data:', data);
              setCourse(data); 
          } else { // Handling non-200 responses
              console.log('Non-200 status code:', response.status);
              throw new Error('Non-200 response');
          }   
      } catch (error) {
          console.log("Error fetching Course", error); 
          setError(error); // Ensure error message is captured
      } finally {
          setIsLoading(false); 
      }
  };

    fetchCourse();
  }, [id]); 


  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE' 
      });
      if (!response.ok) {
        throw new Error('Delete request failed'); 
      }
      navigate('/courses'); 
    } catch (error) {
      // Handle deletion errors (e.g., display an error message)
    }
  };

  if (isLoading) {
    return <div>Loading course...</div>;
  }

  if (error) {
    return <div>Error fetching course: {error.message}</div>;
  }

  return (
    <div>
      <h2>{course.title}</h2> 
      {/* ... display other course details */}
      <button onClick={handleDelete}>Delete Course</button>
      <Link to={`/courses/${id}/update`}>Update Course</Link> 
      <Link to="/courses">Back to Courses</Link> 
    </div>
  );
}

export default CourseDetail;