import { default as axios } from "./axiosConfig"
import type { User } from "./types";

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