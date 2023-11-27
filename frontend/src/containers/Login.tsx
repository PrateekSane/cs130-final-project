import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
//import { useAuth } from "../Auth/AuthProvider";
import { LoginFormValues } from "./interfaces";

const LoginPage = () => {
  //const auth = useAuth();
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

  const onSubmit = (e: React.ChangeEvent<HTMLFormElement>): void => {
    console.log("login here");
    console.log(loginData);
    e.preventDefault();
    /*
        if (!auth) return;
        console.log('enter')
        auth.login({ name: 'jim', firstName: 'jim', lastName: 'jim' })
        


        */
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
