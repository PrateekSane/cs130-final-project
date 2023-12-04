import { Link, Outlet } from "react-router-dom";
import {useEffect, useState, useContext} from "react";
import AuthContext from "./AuthContext";
import "./general.css";

const Navbar = () => {


  let authContext = useContext(AuthContext);
  if (!authContext) {
    // Handle the case when AuthContext is not available
    return <div>Auth context is not available</div>;
  }
  let {user, logoutUser} = authContext;
  
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
          {user ? 
            <li>
              <Link to = "/games">Games</Link>
            </li>: (<></>)
          }
        </ul>
        <ul className="right-contents">

          {user ? (
            <li className = "logout-button">
              <button onClick={(e:any) => logoutUser(e)}>Logout</button>
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
