import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Navbar = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/stocks">Stocks</Link>
                    </li>
                    <li>
                        <Link to="/login">Log In</Link>
                    </li>
                    <li>
                        impliment some protected pages with auth --- 
                        <Link to="/protected/settings">settings</Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    )
}

export default Navbar
