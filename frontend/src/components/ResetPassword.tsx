import { Anchor, Box, Button, Center, Container, Group, LoadingOverlay, Paper, Text, TextInput, Title, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import classes from './styles/LoginForm.module.css';
import axios from "../axiosConfig";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";


/**
 * Form component for resetting password
 * 
 * Not to be confused with ForgetPassword
 */
function ResetPassword() {

  const params = useParams<{ email: string, token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  // if there are no params, then redirect to forget passwrd route
  useEffect(() => {
    setLoading(true);
    if (!params.email || !params.token) {
      navigate("/forget_password");
      return;
    }

    // verify jwt
    const verify = async () => {
      try {
        const response = await axios.get(`/verify_reset_token/${params.email}/${params.token}`);
        setVerified(true);
      } catch (err) {
        if (isAxiosError(err)) {
          if (err.code === "401") {
            notifications.show({ message: err.response?.data.error })
          }
          console.error(err);
          setVerified(false);
        }
      }
    }
    verify();
    setLoading(false);
  })


  const form = useForm({
    name: "resetPassword",
    mode: "controlled",
    initialValues: {
      password: "",
      confirmPassword: ""
    },

    validate: {
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    }
  })

  const handleSubmit = async (data: { password: string, confirmPassword: string }) => {
    try {
      const response = await axios.post(
        `reset_password/${params.email}/${params.token}`,
        { password: data.password }
      );
      navigate("/login");
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.error
        form.setErrors({
          password: msg,
          confirmPassword: msg
        })
      }
    }
  }

  if (loading) {
    return <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
  }

  if (verified) {
    return (
      <Container size={460} my={30}>
        <Title className={classes.title} ta="center">
          Reset password
        </Title>
        <Text c="dimmed" fz="sm" ta="center">
          Create a new passsord
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
            <TextInput mb="md" type="password" label="New password" placeholder="" autoComplete='off' key={form.key("password")}
              {...form.getInputProps('password')} required withAsterisk />
            <TextInput mb="md" type="password" label="Confirm password" placeholder="" autoComplete='off' key={form.key("confirmPassword")}
              {...form.getInputProps('confirmPassword')} required withAsterisk />
            <Group justify="space-between" mt="lg" className={classes.controls}>
              <Anchor c="dimmed" size="sm" className={classes.control}>
                <Center inline>
                  <IconArrowLeft style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  <Box ml={5} onClick={() => navigate("/login")}>I rembered my password</Box>
                </Center>
              </Anchor>
              <Button
                className={classes.control}
                loading={loading}
                type="submit"
              >
                Confirm
              </Button>
            </Group>
          </Paper>
        </form>
      </Container>
    );
  } else {
    return (
      <Container size={460} my={30}>
        <Title className={classes.title} ta="center">
          Reset password
        </Title>
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl" >
          <Text mb="md" ta="center">
            The reset link is invalid or has expired. <br />
            Please request for a new link.
          </Text>
          <Button fullWidth onClick={() => navigate("/forgot_password", { replace: true })}>
            Request link
          </Button>
        </Paper>
      </Container>
    )
  }
}

export default ResetPassword;