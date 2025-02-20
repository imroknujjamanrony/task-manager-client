import { createBrowserRouter } from "react-router-dom";
import Home from "../page/Home";
import MainLayout from "../mainLayout/MainLayout";
import Login from "../page/Login/Login";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
    ],
  },
]);
export default router;
