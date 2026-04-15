import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout ";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import ChatDesign from "../pages/ChatDesign";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import { Admin } from "../pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "signup", element: <Signup /> },
      { path: "signin", element: <Signin /> },
      { path: "chat", element: <Chat /> },
      { path: "chat-design", element: <ChatDesign /> },
      { path: "admin", element: <Admin /> },
    ],
  },
]);