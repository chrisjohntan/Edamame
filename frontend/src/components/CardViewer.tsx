import { Box, Button, LoadingOverlay, Modal, Text } from "@mantine/core";
import { Card } from "../types";
import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { isAxiosError } from "axios";
import { dataToCard } from "./utils";

// if Card is passed as prop, render the card
// else call backend for next card in the deck
function CardViewer(props: { card?: Card, deckId: number, opened: boolean, onClose: () => void }) {
  // const cardData
  const [loading, setLoading] = useState(false);
  console.log("opened")

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
    try {
      setLoading(true);
      const response = await axios.get(`/next_card/${props.deckId}`);
      setCurrentCard(dataToCard(response));
    } catch (err) {
      if (isAxiosError(err)) {
        
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (props.card) {
      setCurrentCard(props.card);
    } else {
      getNextCard();
    }
  }, [])

  if (props.card) {
    return (
      <>
        <Modal
          opened={props.opened}
          onClose={props.onClose}
        >
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
          {
            side === "front"
              ? (
                <Box>
                  <Text ta="center">{props.card.header}</Text>
                  <Text ta="center">{props.card.body}</Text>
                  <Button onClick={toggleSide}>Show back</Button>
                </Box>
              ) : (
                <Box>
                  <Text ta="center">{props.card.header_flipped}</Text>
                  <Text ta="center">{props.card.body_flipped}</Text>
                  <Button onClick={toggleSide}>Show front</Button>
                  <Button onClick={()=>{toggleSide();getNextCard();}}>Next card</Button>
                </Box>
              )
          }
        </Modal>
      </>
    )
  }
}

export default CardViewer;
