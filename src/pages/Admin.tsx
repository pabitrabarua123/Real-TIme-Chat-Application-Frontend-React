import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Admin = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    console.log("Admin page useEffect called with user:", user, "and loading:", loading);
    if (!loading && !user) {
       navigate("/signin");
    }
  }, [loading, user, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100"> 
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
                Admin Dashboard
            </h2>
            <p className="text-center text-gray-700">
                Welcome to the admin dashboard. Here you can manage users and view analytics.
            </p>
        </div>
    </div>
  );
}