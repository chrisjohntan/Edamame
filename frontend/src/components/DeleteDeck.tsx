import { Deck } from "../types"
import axios from "../axiosConfig"
import { useDisclosure } from "@mantine/hooks"
import { ActionIcon, Button, Group, Modal, rem } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

function DeleteDeck(props: {data: Deck[], setData: (d: Deck[])=>void, deckId: number}) {
  const [opened, {open, close}] = useDisclosure();
  
  const handleDelete = async () => {
    try {
      const reponse = await axios.delete(`/delete_deck/${props.deckId}`);
      props.setData(props.data.filter(data => data.id != props.deckId))
    } catch (err) {
      console.error(err)
    }
  }
  
  return (
    <>
      <ActionIcon variant="subtle" color="red" onClick={open}>
        <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      </ActionIcon>
      <Modal
        opened={opened}
        onClose={close}
        title={<div><h3>Delete deck?</h3></div>}
      >
        <p>All cards in the deck will also be deleted.</p>
        <p>This action is irreversible!</p>
        <Group justify="end">
          <Button radius="xl" color="blue" onClick={close} variant="light">Cancel</Button>
          <Button radius="xl" variant="danger" onClick={handleDelete}>Delete forever</Button>
        </Group>
      </Modal>
    </>
  )
}

export default DeleteDeck