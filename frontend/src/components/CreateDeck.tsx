import { Button, Modal, ModalContent, Paper, TextInput, UnstyledButton, rem } from "@mantine/core";
import { useState } from "react";
import { IconCircleXFilled, IconPlus, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import axios from "../axiosConfig";
import { AxiosResponse, isAxiosError } from "axios";
import { Deck } from "../types";
import { useNavigate } from "react-router-dom";

function CreateDeck(props: {addData: (d: Deck)=>void}) {
  const [opened, { open, close }] = useDisclosure();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      deckName: ""
    },
    validate: {
      deckName: (value) => value.length <= 0 ? "Cannot be empty" : null
    }
  })

  const handleCreate = async (data: { deckName: string }) => {
    try {
      setLoading(true);
      const response: AxiosResponse = await axios.post("/create_deck", { deck_name: data.deckName })
      const deck = response.data.deck as Deck
      props.addData(deck)
      form.reset()
      // should navigate to the view deck page to add cards
      // and set timeout
      // navigate()
    } catch (err) {
      if (isAxiosError(err)) {
        form.setErrors({deckName: err.response?.data.message})
      } else {
        console.error(err)
      }
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
        title={<><h3>Create Deck</h3></>}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={!loading}>
        <form onSubmit={form.onSubmit(handleCreate)}>
          <TextInput label="Deck name" mb="md" autoComplete="off" key={form.key("deckName")}
            {...form.getInputProps('deckName')} required withAsterisk 
            rightSection={<UnstyledButton onClick={form.reset} component={IconCircleXFilled}/>}/>
          <Button type="submit" loading={loading}>Create</Button>
        </form>
      </Modal>
    </>
  )
}


export default CreateDeck;