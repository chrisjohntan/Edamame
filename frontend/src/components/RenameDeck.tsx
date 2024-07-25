import { ActionIcon, Button, Group, Modal, NumberInput, Text, TextInput, UnstyledButton, rem } from "@mantine/core";
import { IconCircleX, IconCircleXFilled, IconPencil, IconX } from "@tabler/icons-react";
import axios from "../axiosConfig"
import { useDisclosure } from "@mantine/hooks"
import { Deck } from "../types";
import { useForm } from "@mantine/form";
import { useState } from "react";
import DeckTable from "./DeckTable";
import { AxiosError, isAxiosError } from "axios";

// forgotMultiplier
// hardMultiplier
// okayMultiplier
// easyMultiplier
// forgot_multiplier
// hard_multiplier
// okay_multiplier
// easy_multiplier

function RenameDeck(props: {data: Deck[], deck: Deck, setData: (d:Deck[])=>void}) {
  const [opened, {open, close}] = useDisclosure();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: "controlled",
    initialValues: {
      deckName: props.deck.deck_name,
      forgotMultiplier:props.deck.forgot_multiplier,
      hardMultiplier:props.deck.hard_multiplier,
      okayMultiplier:props.deck.okay_multiplier,
      easyMultiplier:props.deck.easy_multiplier,
    },
    validate: {
      deckName: (value) => value.length <= 0 ? "Cannot be empty" : null,
      forgotMultiplier: (value) => value < 0 ? "Cannot be negative" : null,
      hardMultiplier: (value) => value < 0 ? "Cannot be negative" : null,
      okayMultiplier: (value) => value < 0 ? "Cannot be negative" : null,
      easyMultiplier: (value) => value < 0 ? "Cannot be negative" : null,
    }
  });
  
  const handleEdit = async (input: {deckName: string, forgotMultiplier: number, hardMultiplier: number, okayMultiplier: number, easyMultiplier:number}) => {
    try {
      setLoading(true)
      const payload = {
        "deck_name": input.deckName,
        "forgot_multiplier":  input.forgotMultiplier,
        "hard_multiplier": input.hardMultiplier,
        "okay_multiplier": input.okayMultiplier,
        "easy_multiplier": input.easyMultiplier,
      }
      const reponse = await axios.put(`/edit_deck/${props.deck.id}`, payload);
      // props.deck.deck_name = input.deckName
      const mapper = (d: Deck) => {
        if (d.id === props.deck.id) {
          d.deck_name = input.deckName;
          d.forgot_multiplier = input.forgotMultiplier
          d.hard_multiplier = input.hardMultiplier
          d.okay_multiplier = input.okayMultiplier
          d.easy_multiplier = input.easyMultiplier
        }
        return d;
      }
      props.setData(props.data.map(mapper))
      close()
    } catch (err) {
      if (isAxiosError(err)){
        form.setErrors({deckName: err.response?.data.message})
      } else {
        console.error(err)
      }
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <ActionIcon variant="subtle" color="gray" onClick={open}>
        <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={2} />
      </ActionIcon>
      <Modal
        opened={opened}
        onClose={close}
        title={<Text size="xl">Edit deck</Text>}
      >
        <form onSubmit={form.onSubmit(handleEdit)}>
          <TextInput label="Deck name" mb="md" autoComplete="off" key={form.key("deckName")}
            {...form.getInputProps('deckName')} required withAsterisk
            rightSection={<UnstyledButton onClick={()=>form.setFieldValue('deckName', "")} component={IconCircleXFilled}/>}/>

          <NumberInput label="Forgot Multiplier" mb="md" autoComplete="off" key={form.key("forgotMultiplier")}
            {...form.getInputProps('forgotMultiplier')} required withAsterisk
            rightSection={<UnstyledButton onClick={()=>form.setFieldValue('forgotMultiplier', props.deck.forgot_multiplier)} component={IconCircleXFilled}/>}/>

          <NumberInput label="Hard Multiplier" mb="md" autoComplete="off" key={form.key("hardMultiplier")}
            {...form.getInputProps('hardMultiplier')} required withAsterisk
            rightSection={<UnstyledButton onClick={()=>form.setFieldValue('hardMultiplier', props.deck.hard_multiplier)} component={IconCircleXFilled}/>}/>

          <NumberInput label="Okay Multiplier" mb="md" autoComplete="off" key={form.key("okayMultiplier")}
            {...form.getInputProps('okayMultiplier')} required withAsterisk
            rightSection={<UnstyledButton onClick={()=>form.setFieldValue('okayMultiplier', props.deck.okay_multiplier)} component={IconCircleXFilled}/>}/>

          <NumberInput label="Easy Multiplier" mb="md" autoComplete="off" key={form.key("easyMultiplier")}
            {...form.getInputProps('easyMultiplier')} required withAsterisk
            rightSection={<UnstyledButton onClick={()=>form.setFieldValue('easyMultiplier', props.deck.easy_multiplier)} component={IconCircleXFilled}/>}/>

          <Button type="submit" loading={loading}>Update</Button>
        </form>
      </Modal>
    </>
  )
}

export default RenameDeck;