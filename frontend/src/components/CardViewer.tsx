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
      console.log("getting next card..")
      setLoading(true);
      const response = await axios.put(`/next_card/${props.deckId}`);
      console.log(response)
      setCurrentCard(dataToCard(response.data.card));
    } catch (err) {
      if (isAxiosError(err)) {
        
      }
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

  if (loading) {
    return <div>loading</div>
  }

  if (currentCard) {
    console.log("card" + currentCard.header)
    return (
      <>
        <Modal
          // opened={props.opened}
          opened={props.opened}
          onClose={props.onClose}
        >
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
          {
            side === "front"
              ? (
                <Box>
                  <Text ta="center">{currentCard.header}</Text>
                  <Text ta="center">{currentCard.body}</Text>
                  <Button onClick={toggleSide}>Show back</Button>
                </Box>
              ) : (
                <Box>
                  <Text ta="center">{currentCard.header_flipped}</Text>
                  <Text ta="center">{currentCard.body_flipped}</Text>
                  <Button onClick={toggleSide}>Show front</Button>
                  <Button onClick={()=>{toggleSide();getNextCard();}}>Next card</Button>
                </Box>
              )
          }
        </Modal>
      </>
    )
  } else {
    return <div>dddd</div>
  }
}

export default CardViewer;
