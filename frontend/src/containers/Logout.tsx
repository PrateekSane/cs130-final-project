import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
    const nav = useNavigate();
    const logoutEndpoint = 'http://127.0.0.1:8000/logout/';
    useEffect(() => {
        (async () => {
          await  fetch (logoutEndpoint,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: localStorage.getItem('authtoken'),
            }),
            credentials: 'same-origin',
            })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                localStorage.clear();
                nav('/');
            }
            )
            .catch((error) => console.error('An unexpected error occurred:', error));
            
          })();
     }, []);
     return (<div></div>)
}
export default Logout;