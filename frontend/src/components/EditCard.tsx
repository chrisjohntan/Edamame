import { Button, Divider, Group, Menu, Modal, Stack, Text, TextInput, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { useState } from "react";
import { Card } from "../types";
import { useForm } from "@mantine/form";
import axios from "../axiosConfig";
import { dataToCard } from "./utils";

function EditCard(
  { card, data, setData }: { card: Card, data: Card[], setData: (c: Card[]) => void }
) {
  const [opened, { open, close }] = useDisclosure();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: "controlled",
    initialValues: {
      header: card.header,
      body: card.body,
      header_flipped: card.header_flipped,
      body_flipped: card.body_flipped
    }
  })

  const handleEdit = async (cardData: any) => {
    try {
      setLoading(true);
      const response = await axios.put(`/edit_card/${card.id}`, cardData)
      const returnCard = dataToCard(response.data.card)
      const mapper = (c: Card) => {
        if (c.id === card.id) {
          c = returnCard;
        }
        return c;
      }
      setData(data.map(mapper));
      close();
    } catch (err) {
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Menu.Item
        onClick={open}
        leftSection={<IconPencil style={{ width: rem(14), height: rem(14) }} />}
      >
        Edit card
      </Menu.Item>
      <Modal
        opened={opened}
        onClose={close}
        title={<Text size="xl">Edit card</Text>}
        closeOnClickOutside={false}
        closeOnEscape
        withCloseButton={!loading}
        size="lg">
        <form onSubmit={form.onSubmit(handleEdit)}>
          {/* editing card will only be manual */}
          <Group
            wrap="nowrap"
            align="center"
            justify="center"
          >
            <Stack style={{flexGrow:1}}>
              <Text style={{textAlign:"center"}}>Front</Text>
              <TextInput label="Header" autoComplete="off" key={form.key("header")}
                {...form.getInputProps('header')} required withAsterisk />
              <TextInput label="Body" autoComplete="off" key={form.key("body")}
                {...form.getInputProps('body')} />
            </Stack>
            <Divider orientation="vertical" size="md" />
            <Stack style={{flexGrow:1}}>
              <Text  style={{textAlign:"center"}}>Back</Text>
              <TextInput label="Header" autoComplete="off" key={form.key("header_flipped")}
                {...form.getInputProps('header_flipped')} required withAsterisk />
              <TextInput label="Body" autoComplete="off" key={form.key("body_flipped")}
                {...form.getInputProps('body_flipped')} />
            </Stack>
          </Group>
          <Button type="submit" w="100%" mt="lg">Save</Button>
        </form>

      </Modal>

    </>
  )
}

export default EditCard;