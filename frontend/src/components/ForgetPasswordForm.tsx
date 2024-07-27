import axios from "../axiosConfig";
import {
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  rem,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import classes from './styles/ForgetPassword.module.css';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { notifications } from "@mantine/notifications";

function ForgotPassword() {
  const navigate = useNavigate();
  const form = useForm({
    name: "resetPassword",
    mode: "controlled",
    initialValues: {
      email: "",
    },

    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    }
  })

  const [disabled, setDisabled] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      console.log(seconds)
      const interval = setInterval(()=>setSeconds(seconds - 1), 1000)
      return ()=>clearInterval(interval);
    } else {
      setDisabled(false)
    }
  }, [seconds])

  const timer = () => {
    setDisabled(true);
    if (!requested) {
      setSeconds(5);
      setRequested(true);
    } else {
      setSeconds(10)
    }
  }



  const handleSubmit: (data: { email: string }) => void = async (data) => {
    timer();
    try {
      const response = await axios.get(`/send_forgot_password_email/${data.email}`)
      notifications.show({message: "Link successfully sent. Please check your inbox."})
    } catch (err) {
      if (isAxiosError(err)) {
        const message = err.response?.data?.error;
        form.setErrors({email: message ? message : err.message})
      }
      console.log(err)
    }
  }

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} ta="center">
        Forgot password
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        A reset link will be sent to your registered email
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <TextInput mb="md" type="email" label="Your email" placeholder="you@edamame.com" autoComplete='off' key={form.key("email")}
            {...form.getInputProps('email')} required withAsterisk />
          <Group justify="space-between" mt="lg" className={classes.controls}>
            <Anchor c="dimmed" size="sm" className={classes.control}>
              <Center inline>
                <IconArrowLeft style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                <Box ml={5} onClick={() => navigate("/login")}>Return to login</Box>
              </Center>
            </Anchor>
            <Button
              className={classes.control}
              type="submit"
              disabled={disabled}
            >
              {disabled ? seconds : requested ? "Resend Link" : "Send Link"}
            </Button>
          </Group>
        </Paper>
      </form>
    </Container>
  );
}

export default ForgotPassword;