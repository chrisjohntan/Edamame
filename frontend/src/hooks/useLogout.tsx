import useAuth from "./useAuth";
import axios from "../axiosConfig";
import { EMPTY_AUTH } from "../types";

/**
 * Log out current user
 * 
 * Set global auth context to empty Auth object
 */
const useLogout = () => {
  const { setAuth } = useAuth();

  const logout =  () => {
    setAuth(EMPTY_AUTH);
    try {
      const response = axios.post('/logout', {
        withCredentials: true
      });
    } catch (err) {
      console.error(err);
    }
  }
  return logout;
}

export default useLogout;