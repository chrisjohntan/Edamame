import { useDisclosure } from "@mantine/hooks";
import { Card } from "../types";
import { useState } from "react";
import { useForm } from "@mantine/form";
import axios from "../axiosConfig";
import { isAxiosError } from "axios";
import { IconPlus } from "@tabler/icons-react";
import { Button, rem } from "@mantine/core";
import { dataToCard } from "./utils";

function CreateCard(props: { addData: (c: Card)=>void }) {
  const [opened, { open, close }] = useDisclosure();
  const [loading, setLoading] = useState(false);
  const form = useForm()

  const handleCreate = async (cardData: {}) => {
    try {
      setLoading(true);
      const response = await axios.post("create_card")
      const card = dataToCard(response.data.card)
    } catch (err) {
      if (isAxiosError(err)) {
        
      }
    }
  }

  return (
    <>
      <Button
        leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }} />}
        onClick={open} >
        New Deck
      </Button>
      
    </>
  )
}

export default CreateCard;