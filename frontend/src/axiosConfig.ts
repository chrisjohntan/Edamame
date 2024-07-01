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
instance.defaults.headers.common["Content-Type"] = "application/json"
instance.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie("csrf_access_token");
    if (csrfToken) {
      config.headers["X-CSRF-TOKEN"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default instance;