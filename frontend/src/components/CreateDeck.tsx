import { Button, Modal, ModalContent, Paper, TextInput, UnstyledButton, rem } from "@mantine/core";
import { useState } from "react";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import axios from "../axiosConfig";
import { AxiosResponse } from "axios";
import { Deck } from "../types";
import { useNavigate } from "react-router-dom";

function CreateDeck() {
  const [opened, { open, close }] = useDisclosure();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      deckName: ""
    }
  })

  const handleSubmit = async (data: { deckName: string }) => {
    try {
      setLoading(true);
      const response: AxiosResponse = await axios.post("/create_deck", { deck_name: data.deckName })
      // should navigate to the view deck page to add cards
      // and set timeout
    } catch (err) {
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }} />}
        onClick={open} >
        New Deck
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        transitionProps={{ transition: "pop", duration: 0 }}
        title="Create Deck"
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={!loading}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Deck name" mb="md" autoComplete="off" key={form.key("deckName")}
            {...form.getInputProps('deckName')} required withAsterisk rightSection={<UnstyledButton onClick={form.reset} component={IconX} stroke={1.5}/>}/>
          <Button type="submit" loading={loading}>Create</Button>
        </form>
      </Modal>
    </>
  )
}


export default CreateDeck;