import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
//import { useAuth } from "../Auth/AuthProvider";
import { LoginFormValues } from "./interfaces";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  //const auth = useAuth();
  const nav = useNavigate();
  const [loginData, setLoginData] = useState<LoginFormValues>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>): Promise<void>=> {
    console.log("login here");
    console.log(loginData);
    e.preventDefault();

    const loginEndpoint = 'http://127.0.0.1:8000/login/';
    const data = {
      email: loginData.email,
      password: loginData.password,
    };
        // Make a POST request to the user registration endpoint
      await fetch(loginEndpoint, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      }).then(response => response.json())
      .then(result => {
        if (result.access){
          localStorage.setItem('authtoken', result.access);
          nav("/");
        } else {
          console.log("Invalid Credentials");
        }

      })
      .catch((error) => console.error('An unexpected error occurred:', error));
  };


    

  return (
    <>
      <Form
        style={{ display: "block", width: "35%", margin: "0 auto" }}
        onSubmit={onSubmit}
      >
        <h1>Log in here!</h1>
        <Form.Group className="mb-3">
          <Form.Label>Email </Form.Label>
          <Form.Control
            type="text"
            name="email"
            placeholder="bruin@ucla.edu"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password </Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="password"
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Log In
        </Button>
      </Form>
    </>
  );
};

export default LoginPage;
