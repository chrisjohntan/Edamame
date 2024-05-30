import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../auth";
import type { User } from "../types";

function ProtectedRoute() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, []);

  if (loading) {
    return <div>Loading (placeholder)</div>
  }
  
  return user ? <Outlet context={user}/> : <Navigate to="/login" />; 
}

export default ProtectedRoute;