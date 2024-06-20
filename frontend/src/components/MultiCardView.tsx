import { Group } from "@mantine/core";
import { useParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { Card } from "../types";


function MultiCardView() {
  const params = useParams();
  const deckId = params.deckId;
  const [searchFilter, setSearchFilter] = useState("");
  const [data, setData] = useState<Card[]>([])

  useEffect(() => {
    const getCards = async () => {
      
    }
  })

  return (
    <>
      <Group>
        <SearchBar
          searchFilter={searchFilter}
          onSearchFilterChange={setSearchFilter}/>
      </Group>
    </>
  )
}