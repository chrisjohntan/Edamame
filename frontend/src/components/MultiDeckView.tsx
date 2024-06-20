import { useState } from "react";
import { Deck } from "../types";
import SearchBar from "./SearchBar";
import DeckTable from "./DeckTable";
import CreateDeck from "./CreateDeck";
import { Container, Group } from "@mantine/core";

function MultiDeckView() {
  const [searchFilter, setSearchFilter] = useState(""); 

  return (
    <>
      <Group mb="md">
        <SearchBar
          searchFilter={searchFilter} 
          onSearchFilterChange={setSearchFilter}/>
        <CreateDeck/>
      </Group>
      <DeckTable searchFilter={searchFilter} view="table"/>
    </>
  )
}

export default MultiDeckView;