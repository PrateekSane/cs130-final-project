import { Link, Outlet } from "react-router-dom";
import {useEffect, useState} from "react";
import "./general.css";

const Navbar = () => {

  const [isAuth, setIsAuth] = useState(false);
   useEffect(() => {
    console.log("hello");
     if (localStorage.getItem('authtoken') !== null) {
        setIsAuth(true); 
      }
    }, [isAuth]);
  
  return (
    <>
      <nav>
        <ul className="right-contents">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/stocks">Stocks</Link>
          </li>
          <li>
            <Link to="/scoreboard">Scoreboard</Link>
          </li>
        </ul>
        <ul className="right-contents">

          {isAuth ? (
            <li className="logout-button">
              <Link to="/logout">Logout</Link>
            </li>
          ) : (
            <>
              <li className="register-button">
                <Link to="/signup">Register</Link>
              </li>
              <li className="login-button">
                <Link to="/login">Log In</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;

/*


<li>
impliment some protected pages with auth --- 
<Link to="/protected/settings">settings</Link>
</li>
*/
