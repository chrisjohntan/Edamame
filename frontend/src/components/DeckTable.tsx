import { Text, Table, UnstyledButton, Group, Center, rem, ScrollArea, keys, LoadingOverlay } from "@mantine/core";
import { IconChevronUp, IconChevronDown, IconSelector } from "@tabler/icons-react";
import classes from './styles/Table.module.css';
import { useEffect, useState } from "react";
import type { Deck } from "../types";
import axios from "../axiosConfig"

interface ThProps {
  children: React.ReactNode;
  descending: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, descending, sorted, onSort }: ThProps) {
  const Icon = sorted ? (descending ? IconChevronDown : IconChevronUp) : IconSelector;
  return (
    <Table.Th className={classes.control} onClick={onSort}>
      <UnstyledButton onClick={onSort} className={classes.control} >
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: Deck[], filter: string) {
  if (data.length == 0) {
    return [];
  }
  const query = filter.toLowerCase().trim();
  return data.filter(item => item?.deckName.includes(query));
}

function sortData(
  data: Deck[],
  payload: { sortBy: keyof Omit<Deck, "id"> | null; descending: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (sortBy === "size") {
        if (payload.descending) {
          return b[sortBy] - a[sortBy];
        }
        return a[sortBy] - b[sortBy];
      }

      if (payload.descending) {
        return b[sortBy].localeCompare(a[sortBy]);
      }
      return a[sortBy].localeCompare(b[sortBy]);
      
    }),
    payload.search
  );
}



function DeckTable(props: {searchFilter: string, view: "grid"|"table"}) {
  const [view, setView] = useState<"grid"|"table">("table");
  const toggleView = () => {
    if (view === "grid") {
      setView("table");
    } else {
      setView("grid");
    }
  }
  const [sortBy, setSortBy] = useState<keyof Omit<Deck,"id"> | null>(null)
  const [descending, setDescending] = useState(false);
  const [data, setData] = useState<Deck[]>([]);
  const [sortedData, setSortedData] = useState<Deck[]>(data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/get_decks")
        // Parse response
        const parsedResponse = await response.data.map((resObj:any): Deck => ({id: resObj.id, deckName: resObj.deck_name, size: resObj.size}))
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

  useEffect(() => {
    setDescending(!descending)
    setSortedData(sortData(data, {sortBy, descending: descending, search: props.searchFilter}))
    console.log("sorting")
  }, [props.searchFilter, data])
  
  function handleSort(field: keyof Omit<Deck, "id">) {
    const desc = field === sortBy ? !descending : false
    setSortBy(field);
    setDescending(desc);
    setSortedData(sortData(data, {sortBy, descending: descending, search: props.searchFilter}))
  }

  if (view === "table") {
    const rows = sortedData?.map((deck) => (
      <Table.Tr key={deck.id}>
        <Table.Td>{deck.deckName}</Table.Td>
        <Table.Td>{deck.size}</Table.Td>
        {/* <Table.Td>{deck.}</Table.Td> */}
      </Table.Tr>
    ));

    return (
      <ScrollArea type="hover">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Thead>
            <Table.Tr>
              <Th
                sorted={sortBy === 'deckName'}
                descending={descending}
                // TODO: nah this is fucked here
                onSort={() => handleSort('deckName')}
                // style={{padding:0, margin:0}}
              >
                Deck Name
              </Th>
              <Th
                sorted={sortBy === 'size'}
                descending={descending}
                onSort={() => handleSort('size')}
              >
                Size
              </Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={2}>
                  {/* might have to -1 from the colspan */}
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    )
  }
}

export default DeckTable;