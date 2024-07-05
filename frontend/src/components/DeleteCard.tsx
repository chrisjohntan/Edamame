import { Button, Group, Menu, Modal, Text, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import axios from "../axiosConfig";
import { Card } from "../types";

function DeleteCard(props: {card: Card, data: Card[], setData: (c:Card[])=>void}) {
  const [opened, {open, close}] = useDisclosure();

  const handleDelete = async () => {
    try {
      const reponse = await axios.delete(`/delete_card/${props.card.id}`);
      props.setData(props.data.filter(data => data.id != props.card.id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Menu.Item onClick={open} 
        leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />} >
        Delete
      </Menu.Item>

      <Modal
        opened={opened}
        onClose={close}
        title={<Text size="xl">Delete card?</Text>}
      >
        <Text mb="md">This action is irreversible!</Text>
        <Group justify="end">
          <Button radius="xl" color="blue" onClick={close} variant="light">Cancel</Button>
          <Button radius="xl" variant="danger" onClick={handleDelete}>Delete forever</Button>
        </Group>
      </Modal>
    </>

  )
}

export default DeleteCard;