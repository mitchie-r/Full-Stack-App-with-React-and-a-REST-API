'use strict';

const express = require('express');
const User = require('./models').User;
const Course = require('./models').Course;
const { authenticateUser } = require('./middleware/auth-user');
const { asyncHandler } = require('./middleware/async-handler.js');
const { check, validationResult } = require('express-validator');

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const { id, firstName, lastName, emailAddress } = req.currentUser;
  res.status(200).json({ id, firstName, lastName, emailAddress });
}));

// Route that creates a new user and catches SequelizeUniqueConstraint Error
router.post('/users', asyncHandler(async (req, res) => {
  const errors = []; // Array to store validation errors

  // Validate fields
  if (!req.body.firstName) {
    errors.push('Please provide a value for "firstName"');
  }
  if (!req.body.lastName) {
    errors.push('Please provide a value for "lastName"');
  }
  if (!req.body.emailAddress) {
    errors.push('Please provide a value for "emailAddress"');
  } else if (!/^\S+@\S+\.\S+$/.test(req.body.emailAddress)) {
    errors.push('Please provide a valid email address format (example@domain.com)'); 
  } 
  if (!req.body.password) {
    errors.push('Please provide a value for "password"');
  }

  if (errors.length > 0) {
    // Return the validation errors to the client.
    res.status(400).json({ errors });
  } else {
    // Create the user in the database
    try {
      const newUser = await User.create(req.body);

      // Set the status to 201 Created, add a location header, and end the response.
      res.location('/'); // Include location header
      res.status(201).end(); 

    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ message: 'That email address is already in use.' });
      } else {
        throw error;
      }
    }
  }
}));

// Route to return all Courses
router.get('/courses', asyncHandler(async (req, res) => {
  let courses = await Course.findAll();
  res.json(courses);
}));

// Route to return course with specific id
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
      // ... (your attributes and include options) ...
  });

  if (course) {
      res.json(course);
  } else {
      res.status(404).json({ message: "Course not found" }); // Send 404 with a message
  }
  res.json(course);
}));

  

// Route to create a new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  const errors = []; // Array to store validation errors

  // Validate title and description
  if (!req.body.title) {
      errors.push('Please provide a value for "title"');
  }
  if (!req.body.description) {
      errors.push('Please provide a value for "description"');
  }

  if (errors.length > 0) {
      // Return the validation errors to the client.
      res.status(400).json({ errors });
  } else {
      // Create the course in the database
      try {
          const newCourse = await Course.create(req.body);

          // Construct the Location header
          res.location('/');
          res.status(201).end();

      } catch (error) {
          // Consider adding specific error handling, if needed
          throw error; 
      }
  }
}));

// Route to update a course using PUT 
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const errors = []; // Array to store errors

  const course = await Course.findByPk(req.params.id, {
    include: [
      { model: User, as: 'user' } // Include the associated user
    ]
  }); 

  if (course) {
    if (course.user.id !== req.currentUser.id) { // Authorization check
      res.status(403).json({ message: 'You are not authorized to update this course.' }); 
      return; 
    }

      // Check for missing 'title' and 'description'
      if (!req.body.title) {
          errors.push('Please provide a "title".');   
      }
      if (!req.body.description) {
          errors.push('Please provide a "description".');   
      }

      if (errors.length > 0) {
          res.status(400).json({ errors }); 
          return; 
      }

      await course.update(req.body);
      res.status(204).end();

  } else {
      errors.push('Course not found.')
      res.status(404).json({ errors }); 
  }
}));

// Route to delete a course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (course) {
    // Checks for matching userId that created the course and the user that's deleting it
    if (course.userId === req.currentUser.id) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ message: 'You are not authorized to delete this course.' });
    }
  } else {
    res.status(404).json({ message: 'Course not found.' });
  }
}));




module.exports = router;
