import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth(); // Assuming `logout` function exists

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-lg px-4">
      {/* Left: Logo */}
      <div className="flex-1">
        <NavLink
          to="/"
          className="btn btn-ghost text-2xl font-bold text-primary"
        >
          Task Management
        </NavLink>
      </div>

      {/* Right: Menu */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 flex gap-3">
          <li>
            <NavLink to="/" className="btn btn-outline btn-primary">
              Home
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/dashboard" className="btn btn-outline btn-secondary">
              Dashboard
            </NavLink>
          </li> */}

          {/* Show Logout if logged in, otherwise show Login */}
          {user ? (
            <>
              <li>
                <p className="text-base text-purple-600 font-normal">
                  {user?.displayName}
                </p>
              </li>
              <li>
                <button className="btn btn-error" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/login" className="btn btn-success">
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
