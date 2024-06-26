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

export function ForgotPassword() {
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

  const handleSubmit: (data: {email:string})=>void = async (data) => {
    try {
      const response = await axios.post("/reset_password", data)
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} ta="center">
        Reset password
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        A reset link will be sent to your registered email
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <TextInput label="Your email" placeholder="you@edamame.com" autoComplete='off' key={form.key("email")}
            {...form.getInputProps('email')} required withAsterisk />
          <Group justify="space-between" mt="lg" className={classes.controls}>
            <Anchor c="dimmed" size="sm" className={classes.control}>
              <Center inline>
                <IconArrowLeft style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                <Box ml={5} onClick={()=>navigate("/login")}>Return to login</Box>
              </Center>
            </Anchor>
            <Button className={classes.control} type="submit">Reset password</Button>
          </Group>
        </Paper>
      </form>
    </Container>
  );
}