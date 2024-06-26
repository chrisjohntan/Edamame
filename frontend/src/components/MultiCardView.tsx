import { Group } from "@mantine/core";
import { useParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { Card } from "../types";
import axios from "../axiosConfig"
import { AxiosResponse, isAxiosError } from "axios";
import CardTable from "./CardTable";
import { dataToCard } from "./utils";


function MultiCardView() {
  const params = useParams();
  const deckId = params.deckId;
  const [searchFilter, setSearchFilter] = useState("");
  const [data, setData] = useState<Card[]>([])
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string|null>("")
  const [view, setView] = useState<"grid"|"table">("grid")

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/get_decks")
        // Parse response
        // const parsedResponse = response.data.map((resObj:any): Card => ({id: resObj.id, header: resObj.header, size: resObj.size}))
        const parsedResponse: Card[] = response.data.map((obj: any) => dataToCard(obj))
        setData(parsedResponse)
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

  const toggleView = () => {
    if (view === "grid") {
      setView("table");
    } else {
      setView("grid");
    }
  }

  if (error) {
    return <div>{error}</div>
  } else {
    return (
      <>
        <Group mb="md">
          <SearchBar
            searchFilter={searchFilter}
            onSearchFilterChange={setSearchFilter}/>
        </Group>
        <CardTable 
          data={data} 
          setData={setData}
          searchFilter={searchFilter} 
          view={view} 
          loading={pageLoading} />
      </>
    )
  }
}

export default MultiCardView;