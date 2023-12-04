import GrayBox from './GrayBox'
import React, { useState, useContext, FormEvent } from "react";
import {jwtDecode} from "jwt-decode";
import AuthContext, { AuthProvider } from "./AuthContext";
import { parseJsonText } from 'typescript';
import Scoreboard from './Scoreboard';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const makeGame = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const createGameEndpoint = 'http://127.0.0.1:8000/create_game/';
    const data = {
      email: localStorage.getItem("email"),
      password: localStorage.getItem("password")
    };
    try {
        // Make a POST request to the user registration endpoint
        /*const response = await fetch(createGameEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });*/
        const response = await fetch('http://127.0.0.1:8000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('Game created!');
            // Optionally, you can redirect the user to a different page or perform other actions.
            //await loginUser(e, formData);
        } else {
            const errorData = await response.json();
            console.error('Game creation failed:', errorData.error);
            // Handle the error (display a message to the user, etc.)
        }

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        // Handle unexpected errors
    }
  };

const CreateGame = () => {
    return (
        <Form
            style={{ display: "block", width: "45%", margin: "0 auto" }}
            onSubmit={makeGame}
        >
            <Button variant="primary" type="submit">
                Create Game
            </Button>
        </Form>
    )
}

export default CreateGame;