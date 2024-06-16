import { useState } from "react";
import { Deck } from "../types";
import SearchBar from "./SearchBar";

function MultiDeckView() {

  // sort by

  const [searchFilter, setSearchFilter] = useState("");
  


  // const data = 

  return (
    <>
      <SearchBar
        searchFilter={searchFilter} 
        onSearchFilterChange={setSearchFilter}/>
    </>
  )
}

export default MultiDeckView;