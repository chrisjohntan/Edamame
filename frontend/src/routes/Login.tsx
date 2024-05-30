import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <>
      <LoginForm/>
      {/* <Navigate to={"/dashboard"} /> do not do this, infinite loop */}
    </>
  )
}

export default Login;