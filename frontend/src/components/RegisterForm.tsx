import { default as axios } from "../axiosConfig"
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from '@mantine/core';
import classes from './styles/LoginForm.module.css';
import { AxiosError, isAxiosError } from "axios";

type RegFormInput = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}


function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      username: value => 
        (value.length < 4 
          ? 'Minimum length is 4 characters'
          : /^[a-z0-9]+$/i.test(value)
            ? null
            : 'Invalid username'),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    }
  });

  // TODO: validation
  const handleSubmit: (data: RegFormInput) => void = async (data) => {
    console.log(data);
    setLoading(true);
    const payload = { username: data.username, email: data.email, password: data.password };
    try {
      const response = await axios.post("/register", payload);

      navigate("/login", {replace: true});
    } catch (err) {
      if (isAxiosError(err)){
        form.setErrors({email: err.response?.data.message})
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome to Edamame!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor size="sm" component="button" onClick={() => navigate("/login")}>
          Sign in
        </Anchor>
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" placeholder="you@edamame.com" autoComplete="off" key={form.key('email')}
            {...form.getInputProps('email')} required withAsterisk />
          <TextInput label="Username" placeholder="Your username" mt="md" description="Alphanumeric characters only" autoComplete="off" key={form.key('username')}
            {...form.getInputProps('username')} required withAsterisk />
          <PasswordInput label="Password" placeholder="Your password" mt="md" key={form.key("password")}
            {...form.getInputProps("password")} required withAsterisk />
          <PasswordInput label="Confirm Password" placeholder="Confirm password" mt="md" key={form.key("confirmPassword")}
            {...form.getInputProps("confirmPassword")} required withAsterisk />
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Create account
          </Button>
        </Paper>
      </form>
    </Container>
  )

}

export default RegisterForm;