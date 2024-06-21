import axios from "axios";

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts: string[] | undefined = value.split(`; ${name}=`);
  console.log(parts)
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
}

// TODO: change to env variable
const instance = axios.create({baseURL:import.meta.env.VITE_BACKEND_URL})
instance.defaults.withCredentials=true;
instance.defaults.headers.common["X-CSRF-TOKEN"] = getCookie("csrf_access_token");

// axios.defaults.baseURL = "http://localhost:8080"

export default instance;