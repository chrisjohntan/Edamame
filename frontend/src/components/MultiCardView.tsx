import { Anchor, Box, Button, Center, Flex, Group, ScrollArea, Text, UnstyledButton, rem } from "@mantine/core";
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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`/get_cards/${deckId}`)
        // Parse response
        const parsedResponse: Card[] = response.data.data.map((obj: any) => dataToCard(obj))
        setData(parsedResponse)
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
              searchFilter={searchFilter}
              onSearchFilterChange={setSearchFilter}/>
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
              loading={pageLoading} />
          </ScrollArea>
        </div>

        <CardViewer 
          opened={viewerOpened} 
          onClose={()=>setViewerOpened(false)} 
          deckId={deckId}/>
      </div>
    )
  }
}

export default MultiCardView;