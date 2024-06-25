import { Text, Table, UnstyledButton, Group, Center, rem, ScrollArea, keys, LoadingOverlay, ActionIcon, Box, Flex } from "@mantine/core";
import { IconChevronUp, IconChevronDown, IconSelector, IconPencil, IconTrash } from "@tabler/icons-react";
import classes from './styles/Table.module.css';
import { useEffect, useState } from "react";
import type { Deck } from "../types";
import axios from "../axiosConfig"
import DeleteDeck from "./DeleteDeck";
import RenameDeck from "./RenameDeck";
import { useNavigate } from "react-router-dom";



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
        <Group justify="flex-start">
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

function TdText({children}: {children: React.ReactNode}) {
  return ( 
    <Table.Td>
      <Text truncate="end" inherit>
        {children}
      </Text>
    </Table.Td>
  )
}

function filterData(data: Deck[], filter: string) {
  if (data.length == 0) {
    return [];
  }
  const query = filter.toLowerCase().trim();
  return data.filter(item => item?.deck_name.includes(query));
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



function DeckTable(props: {
  searchFilter: string, 
  view: "grid"|"table", 
  loading: boolean, 
  data: Deck[],
  setData: (d:Deck[])=>void
}) {
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
  const [sortedData, setSortedData] = useState<Deck[]>(props.data);
  const navigate = useNavigate();

  useEffect(() => {
    // setSortedData(props.data)
    setSortedData(sortData(props.data, {sortBy, descending: descending, search: props.searchFilter}))
    console.log("sorting")
  }, [props.searchFilter, props.loading, props.data])
  
  function handleSort(field: keyof Omit<Deck, "id">) {
    const desc = field === sortBy ? !descending : false
    setSortBy(field);
    setDescending(desc);
    setSortedData(sortData(sortedData, {sortBy, descending: descending, search: props.searchFilter}))
  }

  if (view === "table") {
    const rows = sortedData?.map((deck) => (
      <Table.Tr key={deck.id} className={classes.row} onClick={()=>navigate(`/cards/${deck.id}`)}>
        
        <TdText>{deck.deck_name}</TdText>
        <Table.Td>{deck.size}</Table.Td>
          {/* <Table.Td>{deck.}</Table.Td> */}
        
        <Table.Td onClick={e => e.stopPropagation()}>
          <Group gap={0} justify="flex-end" wrap="nowrap">
            {/* <ActionIcon variant="subtle" color="gray">
              <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon> */}
            <RenameDeck deck={deck} data={props.data} setData={props.setData}/>
            <DeleteDeck data={sortedData} setData={setSortedData} deckId={deck.id}/>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

    return (
      <Table.ScrollContainer minWidth={700}>
        <LoadingOverlay visible={props.loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 3 }} />
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Th
                sorted={sortBy === 'deck_name'}
                descending={descending}
                // TODO: nah this is fucked here
                onSort={() => handleSort('deck_name')}
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
              <Table.Th className={classes.empty}/>
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
      </Table.ScrollContainer>
    )
  }
}

export default DeckTable;