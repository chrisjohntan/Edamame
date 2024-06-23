import { Text, Table, UnstyledButton, Group, Center, rem, ScrollArea, keys, LoadingOverlay, ActionIcon, Box, Flex } from "@mantine/core";
import { IconChevronUp, IconChevronDown, IconSelector, IconPencil, IconTrash } from "@tabler/icons-react";
import classes from './styles/Table.module.css';
import { useEffect, useState } from "react";
import type { Card, Deck } from "../types";
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

// TODO: change filter params
function filterData(data: Card[], filter: string) {
  if (data.length == 0) {
    return [];
  }
  const query = filter.toLowerCase().trim();
  return data.filter(item => item?.header.includes(query));
}

function sortData(
  data: Card[],
  payload: { sortBy: keyof Omit<Card, "id"> | null; descending: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return payload.descending ? bVal - aVal : aVal - bVal;
      }

      if (aVal instanceof Date && bVal instanceof Date) {
        return payload.descending ? bVal.getTime() - aVal.getTime() : aVal.getTime() - bVal.getTime();
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return payload.descending ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      }

      return 0;
    }),
    payload.search
  );
}



function CardTable(props: {searchFilter: string, view: "grid"|"table", data: Card[]}) {
  const [view, setView] = useState<"grid"|"table">("table");
  const toggleView = () => {
    if (view === "grid") {
      setView("table");
    } else {
      setView("grid");
    }
  }
  const [sortBy, setSortBy] = useState<keyof Omit<Card,"id"> | null>(null)
  const [descending, setDescending] = useState(false);
  const [data, setData] = useState<Card[]>([]);
  const [sortedData, setSortedData] = useState<Card[]>(data);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setSortedData(sortData(data, {sortBy, descending: descending, search: props.searchFilter}))
    console.log("sorting")
  }, [props.searchFilter, data])
  
  function handleSort(field: keyof Omit<Card, "id">) {
    const desc = field === sortBy ? !descending : false
    setSortBy(field);
    setDescending(desc);
    setSortedData(sortData(data, {sortBy, descending: descending, search: props.searchFilter}))
  }

  if (view === "table") {
    const rows = sortedData?.map((deck) => (
      <Table.Tr key={deck.id}>
        <Table.Td>{deck.header}</Table.Td>
        <Table.Td>{deck.body}</Table.Td>
        {/* <Table.Td>{deck.}</Table.Td> */}
        <Table.Td>
          <Group gap={0} justify="flex-end" wrap="nowrap">
            <ActionIcon variant="subtle" color="gray">
              <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="red">
              <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

    return (
      <Table.ScrollContainer minWidth={700}>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 3 }} />
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Th
                sorted={sortBy === 'header'}
                descending={descending}
                onSort={() => handleSort('header')}
              >
                Header
              </Th>
              <Th
                sorted={sortBy === 'body'}
                descending={descending}
                onSort={() => handleSort('body')}
              >
                Size
              </Th>
              <Th
                sorted={sortBy === 'last_reviewed'}
                descending={descending}
                onSort={() => handleSort('last_reviewed')}
              >
                Last Reviewed
              </Th>
              <Th
                sorted={sortBy === 'last_modified'}
                descending={descending}
                onSort={() => handleSort('last_modified')}
              >
                Last Modified
              </Th>
              <Th
                sorted={sortBy === 'reviews_done'}
                descending={descending}
                onSort={() => handleSort('reviews_done')}
              >
                Reviews Done
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

export default CardTable;