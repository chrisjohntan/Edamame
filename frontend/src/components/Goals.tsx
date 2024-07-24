import { ActionIcon, Button, Card, Group, Modal, NumberInput, Progress, rem, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import axios from '../axiosConfig';
import useAuth from "../hooks/useAuth";
import { isAxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useField, useForm } from "@mantine/form";


function Goals() {
  const [reviewsToday, setReviewsToday] = useState(0);
  const [target, setTarget] = useState(0);
  const { auth, setAuth } = useAuth();
  const [opened, {open, close}] = useDisclosure();
  
  useEffect(() => {
    console.log(auth)
    setTarget(auth.user.daily_target);
    const getGoals = async () => {
      try {
        const response = await axios.get("/get_review_counts");
        const data = response.data.review_counts;
        console.log(data)
        if (!data[0]) {
          setReviewsToday(0);
        } else {
          setReviewsToday(data[0].review_count)
        }
      } catch (err) {
        if (isAxiosError(err)) {
          notifications.show({
            message: `An error occurred while fetching data: ${err.code}`, 
            color: "red"
          })
        }
      }
    }
    getGoals();
  },[])

  const editTarget = async ({target} : {target: number}) => {
    try {
      const response = await axios.put("/change_daily_target", {new_target: target});
      setTarget(target);
      close();
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response) {
          notifications.show({
            message: err.response?.data.message,
            color: "red",
          })
        } else {
          notifications.show({
            message: `An error occurred: ${err.message}`,
            color: "red",
          })
        }
      }
    }
  }

  const EditForm = () => {
    const form = useForm({
      initialValues: {
        target: target,
      },
      validate: {
        target: (value) => (Number.isInteger(value) && value > 0 ? null : "Please give a positive number")
      },
    });
    
    return (
      <>
      <ActionIcon variant="subtle" color="gray" onClick={open}>
        <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={2} />
      </ActionIcon>
      <Modal
        opened={opened}
        onClose={close}
        title={<Text size="xl">Edit daily target</Text>}
      >
        <form onSubmit={form.onSubmit(editTarget)}>
          <Group align="center" justify="" m="md">
            <NumberInput
              style={{flexGrow:1}}
              allowNegative={false}
              autoComplete="false"
              allowDecimal={false}
              {...form.getInputProps("target")}
            />
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Modal>
    </>
    )
  }

  return (
    <>
      <Group>
        <Title order={3} mb="sm">
          Daily goal
        </Title>
        <EditForm/>
      </Group>
      <Card withBorder radius="md" padding="xl" bg="var(--mantine-color-body)" w={"40vw"}>
        <Text fz="md" tt="uppercase" fw={700} c="dimmed">
          Day
        </Text>
        <Text fz="md" fw={500}>
          {reviewsToday} / {target} cards reviewed
        </Text>
        <Progress value={reviewsToday / target * 100} mt="md" size="lg" radius="xl" transitionDuration={2000}/>
        {
          reviewsToday < target
            ? `Keep it up! ${target - reviewsToday} cards left!`
            : ""
        }
      </Card>
    </>
  )
}

export default Goals;