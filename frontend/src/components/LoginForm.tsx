import {default as axios} from "../axiosConfig"
import { Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { redirect } from "react-router-dom";
import { logIn } from "../auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { useContext, useRef } from "react";
import useAuth from "../hooks/useAuth";

function LoginForm() {
  // TODO: change to accept either a username or email
  type LoginFormInput = {
    username: string;
    password: string;
  }

  const { auth, setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard"

  // if user is already authenticated then send to dashboard
  // (user ownself go to /login)
  if (auth.user.username != "") {
    navigate("/dashboard");
  }

  // const userRef = useRef();
  // const errRef = useRef();


  const {register, handleSubmit, reset, resetField, formState: {errors}} = useForm<LoginFormInput>()
  const submitForm: SubmitHandler<LoginFormInput> = (data: LoginFormInput) => {
    console.log(data)
    reset();
    logIn(data);
    setAuth({user: {username: data.username}})
    navigate(from, { replace: true });
    
  }
  return (
    <div className="d-flex">
      <div className="form me-auto ms-auto align-center pt-5">
        <h1>Log In</h1><br/>
        <form>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control type="text"
                placeholder="Username"
                {...register("username", {required: true})}
              />
            </Form.Group><br/>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password"
                placeholder="Password"
                {...register("password", {required: true})}
              />
            </Form.Group><br/>
            <Form.Group>
              <button type="button" className="btn btn-success" onClick={handleSubmit(submitForm)}>Login</button>
            </Form.Group>
        </form>
      </div>
    </div>
  )
}

export default LoginForm;