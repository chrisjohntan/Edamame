import { Text, Table, UnstyledButton, Group, Center, rem, ScrollArea, keys, LoadingOverlay, ActionIcon, Box, Flex, Card as MantineCard, Menu, Grid, SimpleGrid, Button, Divider, Title } from "@mantine/core";
import { IconChevronUp, IconChevronDown, IconSelector, IconPencil, IconTrash, IconDotsVertical } from "@tabler/icons-react";
import classes from './styles/Table.module.css';
import { useEffect, useState } from "react";
import type { Card, Deck } from "../types";
import axios from "../axiosConfig"
import DeleteCard from "./DeleteCard";
import EditCard from "./EditCard";
import CardViewer from "./CardViewer";

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
        <Group justify="flex-start" wrap="nowrap">
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

function TdText({ children }: { children: React.ReactNode }) {
  return (
    <Table.Td>
      <Text truncate="end" fz="sm">
        {children}
      </Text>
    </Table.Td>
  )
}

// TODO: change filter params
function filterData(data: Card[], filter: string) {
  if (data.length == 0) {
    return [];
  }
  const query = filter.toLowerCase().trim();
  const fieldExclude = [

  ]
  // 
  // return data.filter(item => item?.header.includes(query));

  return data.filter((item) =>
    keys(data[0]).filter(key => typeof data[0][key] === "string")
      .some((key) => (item[key] as string).toLowerCase().includes(query))
  );
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



function CardTable(props: {
  searchFilter: string,
  view: "grid" | "table",
  data: Card[],
  setData: (c: Card[]) => void,
  loading: boolean
}) {
  const [sortBy, setSortBy] = useState<keyof Omit<Card, "id"> | null>(null)
  const [descending, setDescending] = useState(false);
  const [sortedData, setSortedData] = useState<Card[]>(props.data);

  useEffect(() => {
    setSortedData(sortData(props.data, { sortBy, descending: descending, search: props.searchFilter }))
    console.log("sorting")
    return
  }, [props.searchFilter, props.data])

  function handleSort(field: keyof Omit<Card, "id">) {
    const desc = field === sortBy ? !descending : false
    setSortBy(field);
    setDescending(desc);
    setSortedData(sortData(props.data, { sortBy, descending: descending, search: props.searchFilter }))
  }

  // display the Card data in mantine card
  const DisplayCard = ({ cardData }: { cardData: Card }) => {
    return (
      <MantineCard shadow="sm" padding="lg" radius="md" withBorder onClick={() => console.log("a")}>
        <Group justify="space-between" >
          <Title lineClamp={1} order={4} style={{ flexGrow: 1 }} >{cardData.header}</Title>
          <Box onClick={e => e.stopPropagation()}>
            <Menu shadow="lg" keepMounted>
              <Menu.Target>
                <ActionIcon variant="transparent">
                  <IconDotsVertical />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Actions</Menu.Label>
                <EditCard card={cardData} data={props.data} setData={props.setData}/>
                <DeleteCard card={cardData} data={sortedData} setData={setSortedData} />
              </Menu.Dropdown>
            </Menu>
          </Box>
        </Group>
        <Text mt="md" lineClamp={4}>
          {cardData.body}
        </Text>
      </MantineCard>
    )
  }

  if (props.view === "table") {
    const rows = sortedData?.map((deck) => (
      <Table.Tr key={deck.id}>
        <TdText>{deck.header}</TdText>
        <TdText>{deck.body}</TdText>
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
      <ScrollArea>
        <LoadingOverlay visible={props.loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 3 }} />
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
                Body
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
              <Table.Th className={classes.empty} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6}>
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

  if (props.view == "grid") {
    const rows = sortedData?.map(card => (
      <DisplayCard cardData={card} key={card.id} />
    ))

    return (
      rows.length <= 0 ? (
        <Text fw={500} ta="center">
          Nothing found
        </Text>
      ) :
        <div>
          {/* <ScrollArea scrollbars="y" type="always" p="md" mih={600}> */}
            <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4, xl: 5,  }}>
              {rows}
            </SimpleGrid>
            <Divider mt="lg" label="You have reached the end" />
          {/* </ScrollArea> */}
        </div>
    )
  }

  if (props.loading) {
    return <LoadingOverlay visible={props.loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 3 }} />
  }
}

export default CardTable;