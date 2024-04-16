import React from 'react';
import { Routes, Route } from 'react-router-dom';


import Courses from './components/Courses';  // Assuming Courses component is in a file named Courses.js
import CourseDetail from './components/CourseDetail';  // Assuming CourseDetail component is in a file named CourseDetail.js
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import Header from './components/Header';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';


function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="signin" element={<UserSignIn />} />
        <Route path="signup" element={<UserSignUp />} />
        <Route path="signout" element={<UserSignOut />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/error" element={<UnhandledError />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
