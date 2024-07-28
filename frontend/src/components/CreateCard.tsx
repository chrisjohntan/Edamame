import { useDisclosure } from "@mantine/hooks";
import { Card } from "../types";
import { useState } from "react";
import { useForm } from "@mantine/form";
import axios from "../axiosConfig";
import { isAxiosError } from "axios";
import { IconPlus } from "@tabler/icons-react";
import { Box, Button, Divider, Flex, Group, Modal, SegmentedControl, Slider, Stack, Switch, Text, TextInput, Tooltip, rem } from "@mantine/core";
import { dataToCard } from "./utils";
import { notifications } from "@mantine/notifications";

function CreateCard(props: { addData: (c: Card) => void, deckId: number }) {
  const [opened, { open, close }] = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("manual");
  const [translated, setTranslated] = useState(false);
  const form = useForm({
    mode: "controlled",
    initialValues: {
      header: "",
      body: "",
      header_flipped: "",
      body_flipped: ""
    }
  })

  const getTempCard = async (data: {header: string, body?: string}) => {
    try {
      setLoading(true);
      const payload = {
        header: data.header,
        body: data.body
      }
      console.log(payload)
      const response = await axios.post(`/get_translation_for_card`, payload)
      const tempData: {header:string, body:string, header_flipped:string} = response.data
      form.setFieldValue("header", tempData.header)
      form.setFieldValue("body", tempData.body)
      form.setFieldValue("header_flipped", tempData.header_flipped)
    } catch (err) {
      console.error(err)
      if (isAxiosError(err)) {
        notifications.show({
          message: err.response?.data.message,
          color: "red"
        })
      }
    } finally {
      setTranslated(true);
      setLoading(false);
    }
  }

  const handleCreate = async (cardData: any) => {
    if (type === "auto" && !translated) {
      getTempCard(cardData)
    } else {
      try {
        setLoading(true);
        console.log(cardData)
        const response = await axios.post(`/create_card/${props.deckId}`, { ...cardData, card_type: type })
        const card = dataToCard(response.data.card)
        props.addData(card)
        onClose()
      } catch (err) {
        if (isAxiosError(err)) {
          
        }
      } finally {
        setLoading(false);
        form.reset()
      }
    }
    setTranslated(false)
  }

  const onClose = () => {
    close();
    form.reset()
    setTranslated(false);
  }

  const typeTooltipText = "Auto: Translate fields using DeepL AI"

  return (
    <>
      <Button
        leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }} />}
        onClick={open}
        size="sm" >
        New Card
      </Button>
      <Modal size="xl"
        opened={opened}
        onClose={onClose}
        title={<Text size="xl">New card</Text>}
        closeOnClickOutside={false}
        closeOnEscape
        withCloseButton={!loading}
        padding="lg">
          <form onSubmit={form.onSubmit(handleCreate)}>
            <Tooltip label={typeTooltipText}>
              <SegmentedControl
                data={[{ label: "Manual", value: "manual" }, { label: "Auto", value: "auto" }]}
                value={type}
                onChange={setType}
                disabled={loading}
                mb="md"
              />
            </Tooltip>
            <Group
              wrap="nowrap"
              align="center"
              grow
            >
              <Stack >
                <Text>Front</Text>
                <TextInput label="Header" autoComplete="off" key={form.key("header")}
                  {...form.getInputProps('header')} required withAsterisk />
                <TextInput label="Body" autoComplete="off" key={form.key("body")}
                  {...form.getInputProps('body')} />
              </Stack>
              {
                type === "manual" || translated
                  ?
                  <>
                    <Divider orientation="vertical" size="md" style={{flexGrow: 0}}/>
                    <Stack >
                      <Text>Back</Text>
                      <TextInput label="Header" autoComplete="off" key={form.key("header_flipped")}
                        {...form.getInputProps('header_flipped')} required withAsterisk />
                      <TextInput label="Body" autoComplete="off" key={form.key("body_flipped")}
                        {...form.getInputProps('body_flipped')} />
                    </Stack>
                  </>
                  :
                  null
              }
            </Group>
            {
              type === "auto" && !translated
                ?
                <Button type="submit" mt="lg" fullWidth>Translate</Button>
                :
                <Button type="submit" mt="lg" fullWidth>Add</Button>
            }
          </form>
      </Modal>
    </>
  )
}

export default CreateCard;