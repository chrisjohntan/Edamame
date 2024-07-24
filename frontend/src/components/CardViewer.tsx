/**
 * Popout component for viewing cards
 */

import { Box, Button, Center, Divider, Flex, Group, LoadingOverlay, Modal, Stack, Text } from "@mantine/core";
import { Card } from "../types";
import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { isAxiosError } from "axios";
import { dataToCard, formatInterval } from "./utils";
import { notifications } from "@mantine/notifications";

// if Card is passed as prop, render the card
// else call backend for next card in the deck
function CardViewer(props: { card?: Card, deckId: number, opened: boolean, onClose: () => void }) {
  // const cardData
  const [loading, setLoading] = useState(false);

  /**
   * @todo: should put this in parent
   */
  const [currentCard, setCurrentCard] = useState<Card>()
  

  const [side, setSide] = useState<"front" | "back">("front");
  const toggleSide = () => {
    if (side == "front") {
      setSide("back")
    } else {
      setSide("front")
    }
  }

  const getNextCard = async () => {
    setSide("front")
    try {
      console.log("getting next card..")
      setLoading(true);
      const response = await axios.put(`/next_card/${props.deckId}`, {ignore_review_time: false});
      console.log(response)
      setCurrentCard(dataToCard(response.data.card));
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 404) {
          notifications.show({color: "red", message: err.response.data.message, withBorder: true})
        } else if (err.response?.status === 425) {
          notifications.show({
            color: "red", 
            message: 
              <>
                There are no cards ready for review at this time.<br/>
                Change deck settings to ignore wait time
              </>,
            withBorder: true})
        }
      }
      props.onClose();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (props.opened) {
      if (props.card) {
        setCurrentCard(props.card);
      } else {
        getNextCard();
      }
    }
  }, [props.opened])

  const handleNext = (ease: number) => {
    return async () => {
      if (currentCard) {
        try {
          const response = await axios.put(`/review_card/${currentCard.id}/${ease}`, {});
          notifications.show({message: response.data.message , withBorder:true})
          getNextCard();
        } catch (err) {
          if (isAxiosError(err)) {
            
          }
        }
      }
    }
  }

  if (currentCard) {
    console.log("card" + currentCard.header)
    const intervals: string[] = currentCard.next_time_intervals.map(x => formatInterval(x));
    console.log(currentCard.next_time_intervals);
    return (
      <>
        <Modal
          // opened={props.opened}
          opened={props.opened}
          onClose={()=>{props.onClose();setSide("front")}}
        >
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
          {
            side === "front"
              ? (
                <Box>
                  <Text ta="center" mb="md" size="lg">{currentCard.header}</Text>
                  <Divider size="sm" mb="sm" />
                  <Text ta="center" mb="md">{currentCard.body}</Text>
                  <Center><Button onClick={toggleSide}>Show back</Button></Center>
                </Box>
              ) : (
                <Box>
                  <Text ta="center" mb="md" size="lg">{currentCard.header_flipped}</Text>
                  <Divider size="sm" mb="sm" />
                  <Text ta="center" mb="md">{currentCard.body_flipped}</Text>
                  <Center><Button onClick={toggleSide} mb="xl">Show front</Button></Center>
                  {/* <Flex justify="center"> */}
                    <Group variant="default" ta="center" justify="center">
                      <Stack ta="center" gap={"0"}>
                        <Text style={{marginBottom: 0}}>                        
                          {intervals[0]}
                        </Text>
                        <Button variant="outline" color="black" onClick={handleNext(1)}>Forgot</Button>
                      </Stack>
                      <Stack gap={"0"}>
                        <Text style={{marginBottom: 0}}>                        
                          {intervals[1]}
                        </Text>
                        <Button mt="0" variant="outline" color="red" onClick={handleNext(2)}>Hard</Button>
                      </Stack>
                      <Stack gap={"0"}>
                        <Text style={{marginBottom: 0}}>                        
                          {intervals[2]}
                        </Text>
                        <Button variant="outline" color="green" onClick={handleNext(3)}>Okay</Button>
                      </Stack>
                      <Stack gap={"0"}>
                        <Text style={{marginBottom: 0}}>                        
                          {intervals[3]}
                        </Text>
                        <Button variant="outline" color="blue" onClick={handleNext(4)}>Easy</Button>
                      </Stack>
                    </Group>
                  {/* </Flex> */}
                </Box>
              )
          }
        </Modal>
      </>
    )
  }
}

export default CardViewer;
