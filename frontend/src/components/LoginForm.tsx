import axios from "../axiosConfig"
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from '@mantine/form';
import { useDisclosure } from "@mantine/hooks";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import classes from './styles/LoginForm.module.css';

function LoginForm() {
  // TODO: change to accept either a username or email
  type LoginFormInput = {
    email: string;
    password: string;
  }

  const { auth, setAuth } = useAuth();
  const [loading, { toggle }] = useDisclosure()

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard"

  console.log(auth);

  // if user is already authenticated then send to dashboard
  // (user ownself go to /login)
  useEffect(() => {
    console.log(auth)
    if (auth.user.username != "") {
      navigate("/dashboard");
    }
  }, [auth, navigate])

  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
      password: ""
    },

    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    }
  })

  // TODO: form validation errors (from backend)
  const handleSubmit: (data: LoginFormInput) => void = async (data: LoginFormInput) => {
    console.log(data)
    toggle();
    try {
      const response = await axios.post("/login", data);
      setAuth({ user: { username: response.data.logged_in_as.username } });
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      toggle();
    }
  }
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button" onClick={() => navigate("/signup")}>
          Create account
        </Anchor>
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" placeholder="you@edamame.com" autoComplete="off" key={form.key('email')}
            {...form.getInputProps('email')} required withAsterisk />
          <PasswordInput label="Password" placeholder="Your password" mt="md" key={form.key("password")}
            {...form.getInputProps("password")} required withAsterisk />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  )

}



export default LoginForm;