import axios from "axios";
import { notifications } from "@mantine/notifications";

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts: string[] | undefined = value.split(`; ${name}=`);
  console.log(parts)
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
}


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

// 500 error interceptor
instance.interceptors.response.use(
  (response) => {
    // Return response if successful
    return response;
  },
  (error) => {
    // Check for 500 errors
    console.log("intercepted 500")
    if (error.response && error.response.status === 500) {
      // Display error notification
      notifications.show({
        title: "Server Error",
        message: "An unexpected error occurred. Please try again later.",
        color: "red",
      });
    }
    // reject the promise to allow further error handling
    return Promise.reject(error);
  }
);


export default instance;