import { useState } from "react";
import { Form } from "react-bootstrap"
import {default as axios} from "../axiosConfig"
import { SubmitHandler, useForm } from "react-hook-form";

function LoginForm() {
  // TODO: change to accept either a username or email
  type LoginFormInput = {
    username: string;
    password: string
  }

  const {register, handleSubmit, resetField, formState: {errors}} = useForm<LoginFormInput>()
  const submitForm: SubmitHandler<LoginFormInput> = (data: LoginFormInput) => {
    console.log(data)
    const reponse = axios.post("/login", data, {withCredentials: true});
  }
  return (
    <div className="d-flex">
      <div className="form me-auto ms-auto align-center pt-5">
        <h1>Log In</h1><br/>
        <form>
          <Form>
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
          </Form>
        </form>
      </div>
    </div>
  )
}

export default LoginForm;