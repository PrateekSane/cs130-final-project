import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { SignupFormValues } from "./interfaces";

const SignupPage = () => {
  const [signupData, setSignupData] = useState<SignupFormValues>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSignupData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const onSubmit = (e: React.ChangeEvent<HTMLFormElement>): void => {
    console.log("singup here");
    console.log(signupData);
    e.preventDefault();
    /*
        if (!auth) return;
        console.log('enter')
        */
  };

  return (
    <Form
      style={{ display: "block", width: "35%", margin: "0 auto" }}
      onSubmit={onSubmit}
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
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>First Name: </Form.Label>
        <Form.Control
          type="text"
          name="firstName"
          onChange={handleChange}
          placeholder="Joe"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Last Name: </Form.Label>
        <Form.Control
          type="text"
          name="lastName"
          onChange={handleChange}
          placeholder="Bruin"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
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
  );
};

export default SignupPage;
