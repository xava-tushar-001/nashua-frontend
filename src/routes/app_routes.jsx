import { createBrowserRouter } from "react-router-dom";
import Public from "./Public";
import Protected from "./Protected";
import WildcardRedirect from "./WildcardRedirect";
import MainLayout from "./Layout";
import Login from "../pages/login/Login";
import Home from "../pages/Home";
import Image from "../pages/images/Image";
import User from "../pages/users/User";

export const router = createBrowserRouter([
  {
    element: <Public />,
    children: [{ path: "/login", element: <Login /> }],
  },
  {
    element: <Protected />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/image", element: <Image /> },
          { path: "/users", element: <User /> },

        ],
      },
    ],
  },
  { path: "*", element: <WildcardRedirect /> },
]);