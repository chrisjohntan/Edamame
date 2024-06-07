import { Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import {default as axios} from "../axiosConfig"

function RegisterForm() {
  type RegFormInput = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  const {register, watch, handleSubmit, reset, resetField, formState:{errors}} = useForm<RegFormInput>();
  const submitForm: SubmitHandler<RegFormInput> = (data) => {
    console.log(data);
    reset();
    const payload = {username: data.username, email:data.email, password:data.password};
    const response = axios.post("/register", payload)
  }
  const clearPW = () => {
    if (errors.password || errors.confirmPassword) {
      resetField("password");
      resetField("confirmPassword")
    }
  }

  console.log(watch("password"));
  console.log(watch("confirmPassword"));

  // TODO: finish validation
  return (
    <div className="d-flex ">
      <div className="form me-auto ms-auto align-center pt-5 " >
      {/* style={{width:"30%"}} */}
        <h1>Create account</h1><br/>
        <form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" 
              placeholder="Username" 
              {...register("username", {required:true, minLength:3, maxLength:25, pattern:/^[a-zA-Z0-9]*$/})}
            />
            {errors.username && <p className="small text-danger">Invalid username</p>}
          </Form.Group><br/>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email"
              placeholder="abc@xyz.com"
              {...register("email", {required:true})}
            />
            {errors.email && <p className="small text-danger">Invalid email</p>}
          </Form.Group><br/>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password"
              placeholder="Password"
              {...register("password", {required:true, minLength:8})}
            />
            {errors.password && <p className="small text-danger">Password must contain at least 8 characters</p>}
          </Form.Group><br/>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password"
              placeholder="Re-enter password"
              {...register("confirmPassword", {required:true, validate:(val:string) => val == watch("password")})}
            />
            {errors.confirmPassword && <p className="small text-danger">Password does not match</p>}
          </Form.Group><br/>
          <Form.Group>
            <button type="button" className="btn btn-success ml-auto" onClick={()=>{handleSubmit(submitForm)();clearPW()}}>Submit</button>
            <p>
              <small>
                Already have an account?
              </small>
                <a href="/login">Sign in</a>
            </p>
          </Form.Group>
        </form>
      </div>
    </div>
  )

}

export default RegisterForm;