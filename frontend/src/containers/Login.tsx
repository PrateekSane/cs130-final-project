import React, { useState, useContext, FormEvent } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
//import { useAuth } from "../Auth/AuthProvider";
import { LoginFormValues } from "./interfaces";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const LoginPage = () => {
  //const auth = useAuth();
  const nav = useNavigate();
  

  
  const [loginData, setLoginData] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // Handle the case when AuthContext is not available
    return <div>Auth context is not available</div>;
  }
  const {loginUser} = authContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      const formData = new FormData(e.currentTarget);
      await loginUser(e, formData);
      // Handle successful login
    } catch (error) {
      // Handle login error
      console.error('Login failed', error);
    }
  };

  return (
    <>
      <Form
        style={{ display: "block", width: "35%", margin: "0 auto" }}
        onSubmit={handleSubmit}
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
