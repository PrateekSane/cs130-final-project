import React, { useState } from "react";
//import { useAuth } from "../Auth/AuthProvider";
import { LoginFormValues } from "./interfaces";

const LoginPage = () => {
    //const auth = useAuth();
    const [loginData, setLoginData] = useState<LoginFormValues>({ email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setLoginData((prevValues) => ({
            ...prevValues,
            [name]: value
        }))
    }

    const onSubmit = (e: React.ChangeEvent<HTMLFormElement>): void => {
        console.log('login here')
        /*
        e.preventDefault();
        if (!auth) return;
        console.log('enter')
        auth.login({ name: 'jim', firstName: 'jim', lastName: 'jim' })
        */

    }


    return (
        <div>
            <h1>Log in here!</h1>
            <form onSubmit={onSubmit}>
                <label>Email: </label>
                <input type='text' name='email' value={loginData.email} onChange={handleChange} placeholder="bruin@ucla.edu" />
                <label>Password: </label>
                <input type='text' name='password' value={loginData.password} onChange={handleChange} />
                <button>Log In</button>
            </form>
        </div>
    )
}

export default LoginPage
