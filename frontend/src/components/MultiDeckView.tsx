import { useEffect, useState } from "react";
import { Deck } from "../types";
import SearchBar from "./SearchBar";
import DeckTable from "./DeckTable";
import CreateDeck from "./CreateDeck";
import axios from "../axiosConfig"
import { Container, Group } from "@mantine/core";

function MultiDeckView() {
  const [searchFilter, setSearchFilter] = useState(""); 
  const [data, setData] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"table"|"grid">("table")

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/get_decks")
        // Parse response
        const parsedResponse = await response.data.map((resObj:any): Deck => ({id: resObj.id, deck_name: resObj.deck_name, size: resObj.size}))
        setData(parsedResponse)
        console.log(data)
      } catch (err) {
        console.error(err);
      } finally{
        setLoading(false);
      }
    }
    getData()
  }, [])

  const addData = (newDeck: Deck) => {
    setData([...data, newDeck]);
  }

  return (
    <>
      <Group mb="md">
        <SearchBar
          searchFilter={searchFilter} 
          onSearchFilterChange={setSearchFilter}/>
        <CreateDeck addData={addData}/>
      </Group>
      <DeckTable 
        searchFilter={searchFilter} 
        view={view} 
        data={data} 
        setData={setData} 
        loading={loading}/>
    </>
  )
}

export default MultiDeckView;