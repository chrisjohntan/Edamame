import { Deck } from "../types"
import axios from "../axiosConfig"
import { useDisclosure } from "@mantine/hooks"
import { ActionIcon, Button, Group, Modal, Text, rem } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

function DeleteDeck(props: {data: Deck[], setData: (d: Deck[])=>void, deck: Deck}) {
  const [opened, {open, close}] = useDisclosure();
  
  const handleDelete = async () => {
    try {
      const reponse = await axios.delete(`/delete_deck/${props.deck.id}`);
      props.setData(props.data.filter(data => data.id != props.deck.id))
    } catch (err) {
      console.error(err)
    }
  }
  
  const DeckName = () => {
    return (
      <Text truncate>
        {props.deck.deck_name}
      </Text>
    )
  }

  return (
    <>
      <ActionIcon variant={opened?"filled":"subtle"} color="red" onClick={open} >
        <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5}/>
      </ActionIcon>
      <Modal
        opened={opened}
        onClose={close}
        title={<Text size="xl">Delete deck?</Text>}
      >
        <Text>All cards in the deck will also be deleted.</Text>
        <Text mb="md">This action is irreversible!</Text>
        <Group justify="end">
          <Button radius="xl" color="blue" onClick={close} variant="light">Cancel</Button>
          <Button radius="xl" variant="danger" onClick={handleDelete}>Delete forever</Button>
        </Group>
      </Modal>
    </>
  )
}

export default DeleteDeck