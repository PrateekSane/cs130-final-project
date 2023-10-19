import React, { useState } from "react";
import { SignupFormValues } from "./interfaces";

const SignupPage = () => {
    const [signupData, setSignupData] = useState<SignupFormValues>({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setSignupData((prevValues) => ({
            ...prevValues,
            [name]: value
        }))
        console.log(signupData)
    }

    return (
        <div>
            <h1>Sign Up here!</h1>
            <form onSubmit={() => { console.log("Signed Up") }}>
                <label>Email: </label>
                <input type='text' name='email' value={signupData.email} onChange={handleChange} placeholder="bruin@ucla.edu" />
                <label>First Name: </label>
                <input type='text' name='firstName' value={signupData.firstName} onChange={handleChange} placeholder="Joe" />
                <label>Last Name: </label>
                <input type='text' name='lastName' value={signupData.lastName} onChange={handleChange} placeholder="Bruin" />
                <label>Password: </label>
                <input type='text' name='password' value={signupData.password} onChange={handleChange} />
                <button>Sign Up</button>
            </form>
        </div>
    )
}

export default SignupPage