import { useState } from "react";
import { Deck } from "../types";
import SearchBar from "./SearchBar";
import DeckTable from "./DeckTable";

function MultiDeckView() {

  // sort by

  const [searchFilter, setSearchFilter] = useState("");
  


  // const data = 

  return (
    <>
      <SearchBar
        searchFilter={searchFilter} 
        onSearchFilterChange={setSearchFilter}/>
      <DeckTable searchFilter={searchFilter} view="table"/>
    </>
  )
}

export default MultiDeckView;