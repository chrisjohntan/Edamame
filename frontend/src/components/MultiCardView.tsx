import { Anchor, Box, Button, Center, Flex, Group, ScrollArea, Switch, Text, Tooltip, UnstyledButton, rem } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { Card } from "../types";
import axios from "../axiosConfig"
import { AxiosResponse, isAxiosError } from "axios";
import CardTable from "./CardTable";
import { dataToCard } from "./utils";
import CreateCard from "./CreateCard";
import { IconArrowLeft, IconBook } from "@tabler/icons-react";
import CardViewer from "./CardViewer";
import { notifications } from "@mantine/notifications";


function MultiCardView() {
  const params = useParams();
  const deckId = Number(params.deckId as string);
  const navigate = useNavigate();
  const [searchFilter, setSearchFilter] = useState("");
  const [data, setData] = useState<Card[]>([])
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string|null>("")
  const [view, setView] = useState<"grid"|"table">("grid")
  const [viewerOpened, setViewerOpened] = useState(false)
  const [currentViewing, setCurrentViewing] = useState<Card>()
  const [deckName, setDeckName] = useState("");
  const [ignoreWait, setIgnoreWait] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`/get_cards/${deckId}`)
        // Parse response
        const parsedResponse: Card[] = response.data.data.map((obj: any) => dataToCard(obj))
        setData(parsedResponse)
        setDeckName(response.data.deck_name)
        setIgnoreWait(response.data.ignore_review_time)
        console.log("parsed response " + data)
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data.error) 
        }
        console.error(err);
      } finally{
        setPageLoading(false);
      }
    }
    getData()
  }, [])

  const addData = (newCard: Card) => {
    setData([newCard, ...data])
  }

  const toggleView = () => {
    if (view === "grid") {
      setView("table");
    } else {
      setView("grid");
    }
  }

  const handleIgnore = async (state: boolean) => {
    setIgnoreWait(state);
    try {
      const response = await axios.post(`/ignore_wait/${deckId}`, {ignore_review_time: state});
      notifications.show({
        message: "Preferences saved successfully",
        color: "blue"
      })
    } catch (err) {
      notifications.show({
        title: "Unable to save changes",
        message: "Your preferences will only be applied this time",
        color: "red",
      })
    }
  }

  if (error) {
    console.log(error)
    throw(error);
    return <div>{error}</div>
  } else {
    return (
      <div >
        <div>
          <Anchor
            href="/decks"
            underline="always"
            mb="xl"
            onClick={e=>{e.preventDefault(); navigate("/decks")}}
            w="auto">
              <Center inline mb="xs">
                <IconArrowLeft style={{ width: rem(15), height: rem(15) }}/>
                <Box ml={1}>Back to decks</Box>
              </Center>
          </Anchor>
          <Group mb="md">
            <SearchBar
              placeholder="Search cards"
              searchFilter={searchFilter}
              onSearchFilterChange={setSearchFilter}/>
              <Tooltip label="Allow cards to be reviewed before the time that they are due" refProp="rootRef">
                <Switch
                  checked={ignoreWait}
                  onChange={(event)=>handleIgnore(event.currentTarget.checked)}
                  labelPosition="left"
                  label="Ignore wait time"
                />
              </Tooltip>
            <Button
              onClick={()=>setViewerOpened(true)}
              leftSection={<IconBook/>}
            >
              Review
            </Button>
            <CreateCard addData={addData} deckId={deckId} />
          </Group>
        </div>
        <div>
          <ScrollArea>
            <CardTable
              data={data}
              setData={setData}
              searchFilter={searchFilter}
              view={view}
              loading={pageLoading}
              deckName={deckName} />
          </ScrollArea>
        </div>
        <CardViewer 
          ignoreWait={ignoreWait}
          opened={viewerOpened} 
          onClose={()=>setViewerOpened(false)} 
          deckId={deckId}/>
      </div>
    )
  }
}

export default MultiCardView;