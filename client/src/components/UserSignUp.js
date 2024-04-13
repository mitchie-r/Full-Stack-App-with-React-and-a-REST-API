import { useContext, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import UserContext from '../context/UserContext';
import ValidationErrors from './ValidationErrors';

const UserSignUp = () => {
  const { actions } = useContext(UserContext);
  const navigate = useNavigate();

  // State
  const firstName = useRef(null);
  const lastName = useRef(null);
  const emailAddress = useRef(null);
  const password = useRef(null);
  const [errors, setErrors] = useState([]);

  // event handlers
  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      firstName: firstName.current.value,
      lastName: lastName.current.value,
      emailAddress: emailAddress.current.value,
      password: password.current.value
    }
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(user),
    };

    try {
      const response = await fetch("http://localhost:5000/api/users")
      if (response.status === 201) {
        console.log(`${user.username} is successfully signed up and authenticated!`);
        await actions.signIn(user);
        navigate("/authenticated");
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
  }

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/");
  }

  return (
    <div> {/* Root element for JSX */}
      <main>
        <div className="form--centered">
          <h2>Sign Up</h2>
          {/* Display ValidationErrors component here */}
          <ValidationErrors errors={errors} />
          <form onSubmit={handleSubmit}>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" ref={firstName} type="text" />
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" name="lastName" ref={lastName} type="text" />
            <label htmlFor="emailAddress">Email Address</label>
            <input id="emailAddress" name="emailAddress" ref={emailAddress} type="email" />
            <label htmlFor="password">Password</label>
            <input id="password" name="password" ref={password} type="password" />
            <button className="button" type="submit">
              Sign Up
            </button>
            <button className="button button-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </form>
          <p>
            Already have a user account? Click here to <NavLink to="/signin">sign in</NavLink>!
          </p>
        </div>
      </main>
    </div>
  );
}

export default UserSignUp;