import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
// import axios from "../axios_config";
import { default as axios } from "../axiosConfig"; // configured to baseURL


function Testing() {
  const [message, setMessage] = useState("");
  
  useEffect(()=>{
    console.log("hello")
    const fetchData = async ()=>{
      try {
        const response = await axios.get("/test", {withCredentials: false});
        setMessage(response.data.msg);
      } catch (error) {
          console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, [])
  
  return (
    <Container>
      <h1>{message}</h1>
      <h2>Welcome to Edamame</h2>
      <h4>Bottom text</h4>
    </Container>
  )
}

export default Testing;