import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FaTasks, FaBars } from "react-icons/fa";
import { useContext, useState } from "react";
import { ThemeContext } from "../provider/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Left: Logo & Title */}
        <NavLink to="/" className="text-xl font-bold flex items-center gap-2">
          <FaTasks className="text-2xl" />
          <span>Task Management</span>
        </NavLink>

        {/* Right: Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="rounded-full flex justify-start items-center mr-2  text-gray-900 dark:text-white transition">
            <button onClick={toggleTheme} className=" mr-2">
              {theme === "dark" ? <FiSun size={24} /> : <FiMoon size={24} />}
            </button>
          </div>
          {user && (
            <img
              src={user?.photoURL}
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          )}
          {user ? (
            <>
              <p className="text-base font-normal">{user?.displayName}</p>
              <button
                className="btn btn-sm text-white bg-[#d33] hover:bg-[#d33] "
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-sm btn-success">
              Login
            </NavLink>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 py-3 space-y-3 text-center">
          {user && (
            <img
              src={user?.photoURL}
              alt="User"
              className="w-12 h-12 mx-auto rounded-full border-2 border-white"
            />
          )}
          {user ? (
            <>
              <p className="text-base">{user?.displayName}</p>
              <button
                className="btn btn-sm text-white bg-[#d33] hover:bg-[#d33] w-full"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-sm btn-success w-full">
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
