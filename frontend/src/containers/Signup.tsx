import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import fetchData from "./Api";
import { SignupFormValues } from "./interfaces";
import AuthContext from "./AuthContext";

const SignupPage = () => {
  
    const [signupData, setSignupData] = useState<SignupFormValues>({
        email: '',
        firstName: '',
        lastName: '',
        username: '',
        password: '',
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSignupData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const authContext = useContext(AuthContext);
  const nav = useNavigate();

  if (!authContext) {
    // Handle the case when AuthContext is not available
    return <div>Auth context is not available</div>;
  }
   const {loginUser} = authContext;
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("signup", signupData);
    const registerEndpoint = 'http://127.0.0.1:8000/register/';
    const data = {
      username: signupData.username,
      password: signupData.password,
      email: signupData.email,
      first_name: signupData.firstName,
      last_name: signupData.lastName,
    };
    try {
        // Make a POST request to the user registration endpoint
        const response = await fetch(registerEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('User registered successfully!');
            // Optionally, you can redirect the user to a different page or perform other actions.
            await loginUser(e, formData);
        } else {
            const errorData = await response.json();
            console.error('User registration failed:', errorData.error);
            // Handle the error (display a message to the user, etc.)
        }

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        // Handle unexpected errors
    }
  };

  return (
    <>
    <Form
      style={{ display: "block", width: "45%", margin: "0 auto" }}
      onSubmit={handleSubmit}
    >
      <h1>Sign Up here!</h1>
      <Form.Group className="mb-3">
        <Form.Label>Email: </Form.Label>
        <Form.Control
          type="text"
          name="email"
          placeholder="bruin@ucla.edu"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Username: </Form.Label>
        <Form.Control
          type="text"
          name="username"
          onChange={handleChange}
          placeholder="Bruin Number 1"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>First Name: </Form.Label>
        <Form.Control
          type="text"
          name="firstName"
          onChange={handleChange}
          placeholder="Joe"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Last Name: </Form.Label>
        <Form.Control
          type="text"
          name="lastName"
          onChange={handleChange}
          placeholder="Bruin"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password: </Form.Label>
        <Form.Control
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="password"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Sign Up
      </Button>
    </Form>
    </>
  );
};
    


export default SignupPage;
