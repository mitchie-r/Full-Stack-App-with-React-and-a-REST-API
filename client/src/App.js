import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Courses from './components/Courses';  // Assuming Courses component is in a file named Courses.js
import CourseDetail from './components/CourseDetail';  // Assuming CourseDetail component is in a file named CourseDetail.js
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import Header from './components/Header';
import Error from './components/Error';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/courses" element={<Courses />} /> 
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="signup" element={<UserSignUp />} />
        <Route path="signin" element={<UserSignIn />} />
        <Route path="error" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
