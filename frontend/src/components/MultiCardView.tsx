import { Group } from "@mantine/core";
import { useParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { Card } from "../types";
import axios from "../axiosConfig"
import { AxiosResponse, isAxiosError } from "axios";
import CardTable from "./CardTable";


function MultiCardView() {
  const params = useParams();
  const deckId = params.deckId;
  const [searchFilter, setSearchFilter] = useState("");
  const [data, setData] = useState<Card[]>([])
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string|null>("")
  const [view, setView] = useState<"grid"|"table">("table")

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/get_decks")
        // Parse response
        // const parsedResponse = response.data.map((resObj:any): Card => ({id: resObj.id, header: resObj.header, size: resObj.size}))
        setData(response.data)
        console.log(data)
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data.message) 
        }
        console.error(err);
      } finally{
        setPageLoading(false);
      }
    }
    getData()
  }, [])

  const addData = (newCard: Card) => {
    setData([...data, newCard])
  }

  if (error) {
    return <div>{error}</div>
  } else {
    return (
      <>
        <Group>
          <SearchBar
            searchFilter={searchFilter}
            onSearchFilterChange={setSearchFilter}/>
          <CardTable data={data} searchFilter={searchFilter} view={view} />
        </Group>
      </>
    )
  }
}

export default MultiCardView;