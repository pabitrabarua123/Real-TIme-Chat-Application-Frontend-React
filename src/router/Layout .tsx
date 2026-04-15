import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

const Layout = () => {
  return (
    <AuthProvider>
      {/* <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/admin" className="text-lg font-bold">
            Admin
          </Link>
          <div className="space-x-4">
            <Link to="/signin" className="hover:text-gray-300">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-gray-300">
              Sign Up
            </Link>
          </div>
        </div>
      </nav> */}
      <Outlet />
    </AuthProvider>
  )
};

export default Layout;