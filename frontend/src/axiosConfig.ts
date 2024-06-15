import axios from "axios";

// TODO: change to env variable
const instance = axios.create({baseURL:import.meta.env.VITE_BACKEND_URL})
instance.defaults.withCredentials=true;

// axios.defaults.baseURL = "http://localhost:8080"

export default instance;