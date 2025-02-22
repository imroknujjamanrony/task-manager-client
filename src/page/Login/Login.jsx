import { FaGoogle } from "react-icons/fa";
import Lottie from "lottie-react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import TaskAnimation from "../../assets/TaskLottie.json";

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      console.log("error", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div>
        <Lottie animationData={TaskAnimation} loop={true}></Lottie>
      </div>
      <div>
        <h3 className="mb-4 text-2xl font-semibold">
          Welcome to the Login Page
        </h3>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
        >
          <FaGoogle className="mr-2" />
          Google Login
        </button>
      </div>
    </div>
  );
};

export default Login;
