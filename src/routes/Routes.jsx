// import { createBrowserRouter } from "react-router-dom";
// import Home from "../page/Home";
// import MainLayout from "../mainLayout/MainLayout";
// import Login from "../page/Login/Login";
// import PrivateRoutes from "./privateRoutes/PrivateRoutes";
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainLayout></MainLayout>,
//     children: [
//       {
//         path: "/",
//         element: (
//           <PrivateRoutes>
//             <Home></Home>
//           </PrivateRoutes>
//         ),
//       },
//       {
//         path: "/login",
//         element: <Login></Login>,
//       },
//     ],
//   },
// ]);
// export default router;

import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../mainLayout/MainLayout";
import Home from "../page/Home";
import Login from "../page/Login/Login";
import PrivateRoutes from "./privateRoutes/PrivateRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoutes>
        <MainLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
