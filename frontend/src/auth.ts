import { default as axios } from "./axiosConfig"
import type { User } from "./types";
import { redirect } from "react-router-dom";

// check if user is still logged in
export const getCurrentUser: ()=> Promise<User|undefined> = async () => {
  try {
    const response = await axios.get('/protected', {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('User is not authenticated', error);
    return undefined;
  }
};

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts: string[] | undefined = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
}

export const signOut = async () => {
  try {
    await axios.post('/logout', {}, { withCredentials: true });
    return redirect('/login'); // Redirect to login page after logout
  } catch (error) {
    console.error('Error during sign out', error);
  }
};

export const logIn = async (data: {username: string; password: string}) => {
  try {
    await axios.post('login', data);
    // navigate('/dashboard');
  } catch (error) {
    console.error("Error during login", error);
    throw(error);
  }
}