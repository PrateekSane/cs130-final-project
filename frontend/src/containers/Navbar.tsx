import { Link, Outlet } from "react-router-dom";
import "./general.css";

const Navbar = () => {
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
        </ul>
        <ul className="right-contents">
          <li className="login-button">
            <Link to="/login">Log In</Link>
          </li>
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
