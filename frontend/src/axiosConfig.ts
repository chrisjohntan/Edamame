import axios from "axios";

// TODO: change to env variable
const instance = axios.create({baseURL:"http://localhost:8080"})

// axios.defaults.baseURL = "http://localhost:8080"

export default instance;