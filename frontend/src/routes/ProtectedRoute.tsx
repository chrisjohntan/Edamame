// import { useState, useEffect } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { getCurrentUser } from "../auth";
// import type { User } from "../types";

// function ProtectedRoute() {
//   const [user, setUser] = useState<User>();
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     const getUser = async () => {
//       const user = await getCurrentUser();
//       setUser(user);
//       setLoading(false);
//     }
//     getUser();
//   }, []);

//   if (loading) {
//     return <div>Loading (placeholder)</div>
//   }
  
//   return user ? <Outlet context={user}/> : <Navigate to="/login" />; 
// }

// export default ProtectedRoute;

import axios from "../axiosConfig";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import useLogout from "../hooks/useLogout";
import { notifications } from "@mantine/notifications";

function ProtectedRoute() {
  const { auth, setAuth } = useAuth();
  const location = useLocation();
  const [isLoading, setLoading] = useState(true);
  const logout = useLogout();
  const navigate = useNavigate();

  // if auth is not yet set, check if the token is valid
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("/protected", {withCredentials: true});
        console.log(response.data)
        // if OK, then set auth
        const resData = response.data
        setAuth({user: resData.user})
        console.log(auth)
      } catch (err) {
        console.log("error verifying token:")
        console.error(err);
        logout();
        navigate('/login');
        notifications.show({
          title: "Your session has expired",
          message: "Please log in again",
          color: "red",
        })
      } finally {
        setLoading(false);
      }
    }

    if (auth.user.username == "") {
      // unverified
      verifyToken();
    } else {
      // already verified, no need call api
      setLoading(false);
    }
  }, [auth, setAuth])

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`)
    console.log(`auth info: ${JSON.stringify(auth)}`)
    console.log(`username: ${auth.user.username}` )
  }, [isLoading])

  // do not delete this, if not it will always redirect to login
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    auth.user.username != ""
      ? <Outlet />
      : <Navigate to={"/login"} state={ {from: location} } replace/>
      /* navigate to login if not authenticated,
      but pass along the original destination */
  );
}

export default ProtectedRoute;