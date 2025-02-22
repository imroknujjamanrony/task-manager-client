// import { Navigate, useLocation } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";

// // eslint-disable-next-line react/prop-types
// const PrivateRoutes = ({ children }) => {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return <span className="loading loading-infinity loading-lg"></span>;
//   }
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default PrivateRoutes;

import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoutes;
