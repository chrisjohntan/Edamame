import { useDisclosure } from "@mantine/hooks";
import { Card } from "../types";
import { useState } from "react";
import { useForm } from "@mantine/form";
import axios from "../axiosConfig";
import { isAxiosError } from "axios";
import { IconPlus } from "@tabler/icons-react";
import { Box, Button, Divider, Flex, Group, Modal, SegmentedControl, Slider, Stack, Switch, Text, TextInput, Tooltip, rem } from "@mantine/core";
import { dataToCard } from "./utils";

function CreateCard(props: { addData: (c: Card) => void, deckId: number }) {
  const [opened, { open, close }] = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("manual")
  const form = useForm({
    mode: "controlled",
    initialValues: {
      header: "",
      body: "",
      header_flipped: "",
      body_flipped: ""
    }
  })

  const handleCreate = async (cardData: any) => {
    try {
      setLoading(true);
      const response = await axios.post(`/create_card/${props.deckId}`, { ...cardData, card_type: type })
      const card = dataToCard(response.data.card)
      props.addData(card)
    } catch (err) {
      if (isAxiosError(err)) {

      }
    } finally {
      setLoading(false);
      form.reset()
    }
  }

  const typeTooltip = "Auto (WIP): Translates fields automatically"

  return (
    <>
      <Button
        leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }} />}
        onClick={open}
        size="sm" >
        New Card
      </Button>
      <Modal size="auto"
        opened={opened}
        onClose={close}
        title={<Text size="xl">New card</Text>}
        closeOnClickOutside={false}
        closeOnEscape
        withCloseButton={!loading}
        padding="lg">
        <form onSubmit={form.onSubmit(handleCreate)}>
          <Tooltip label={typeTooltip}>
            <SegmentedControl
              data={[{ label: "Manual", value: "manual" }, { label: "Auto", value: "auto" }]}
              value={type}
              onChange={setType}
              mb="md" />
          </Tooltip>
          <Group
            wrap="nowrap"
            align="start"
          >
            <Stack >
              <Text>Front</Text>
              <TextInput label="Header" autoComplete="off" key={form.key("header")}
                {...form.getInputProps('header')} required withAsterisk />
              <TextInput label="Body" autoComplete="off" key={form.key("body")}
                {...form.getInputProps('body')} />

            </Stack>
            <Divider orientation="vertical" size="md" />
            <Stack >
              <Text>Back</Text>
              <TextInput label="Header" autoComplete="off" key={form.key("header_flipped")}
                {...form.getInputProps('header_flipped')} required withAsterisk />
              <TextInput label="Body" autoComplete="off" key={form.key("body_flipped")}
                {...form.getInputProps('body_flipped')} />
            </Stack>
          </Group>
          <Button type="submit" w="100%" mt="lg">Add</Button>
        </form>
      </Modal>
    </>
  )
}

export default CreateCard;