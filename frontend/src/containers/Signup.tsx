import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import fetchData from "./Api";
import { SignupFormValues } from "./interfaces";

const SignupPage = () => {
  const [signupData, setSignupData] = useState<SignupFormValues>({
    email: "",
    username: "",
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

  const nav = useNavigate();

  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("signup", signupData);
    const registerEndpoint = "register/";
    const data = {
      username: signupData.username,
      password: signupData.password,
      email: signupData.email,
      first_name: signupData.firstName,
      last_name: signupData.lastName,
    };

    const res = await fetchData(registerEndpoint, "POST", data);
    if (res && res.status === 200) {
      nav("/login");
    } else {
      console.log("unable to register");
    }
  };

  return (
    <Form
      style={{ display: "block", width: "45%", margin: "0 auto" }}
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
  );
};

export default SignupPage;
