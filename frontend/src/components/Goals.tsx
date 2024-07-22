import { Card, Progress, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import axios from '../axiosConfig';
import useAuth from "../hooks/useAuth";
import { isAxiosError } from "axios";

function Goals() {
  const [reviewsToday, setReviewsToday] = useState(0);
  const [target, setTarget] = useState(0);

  const { auth } = useAuth();
  
  useEffect(() => {
    console.log(auth)
    setTarget(auth.user.daily_target);
    const getGoals = async () => {
      try {
        const response = await axios.get("/get_review_counts");
        const data = response.data.review_counts;
        if (!data[0]) {
          setReviewsToday(0);
        } else {
          setReviewsToday(data[0].review_count)
        }
        // console.log(review.);
      } catch (err) {
        if (isAxiosError(err)) {

        }
      }
    }
    getGoals();
    // setReviewsToday(50);
  })

  return (
    <>
      <Title order={3} mb="sm">
        Daily goal
      </Title>
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