import useAuth from "./useAuth";
import axios from "../axiosConfig";

/**
 * Log out current user
 * 
 * Set global auth context to empty Auth object
 */
const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({user: {username: ""}});
    try {
      const response = await axios('/logout', {
        withCredentials: true
      });
    } catch (err) {
      console.error(err);
    }
  }
  return logout;
}

export default useLogout;