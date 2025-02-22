import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FaTasks } from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="navbar bg-blue-600  text-white shadow-lg px-">
      {/* Left: Logo & Title */}
      <div className="flex-1">
        <NavLink
          to="/"
          className="btn btn-ghost text-xl font-bold flex items-center gap-2"
        >
          <FaTasks className="text-2xl" />
          Task Management
        </NavLink>
      </div>

      {/* Right: Menu */}
      <div className="flex-none">
        <ul className="menu menu-horizontal flex gap-3">
          <img
            src={user?.photoURL} // Replace with your actual logo/image URL
            alt="Logo"
            className="w-12 h-10 rounded-full"
          />

          {user ? (
            <>
              <li>
                <p className="text-base font-normal">{user?.displayName}</p>
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
