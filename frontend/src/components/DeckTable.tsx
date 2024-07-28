import {
  Text,
  Table,
  UnstyledButton,
  Group,
  Center,
  rem,
  LoadingOverlay,
  ScrollArea,
  Title,
} from "@mantine/core";
import {
  IconChevronUp,
  IconChevronDown,
  IconSelector,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import classes from "./styles/Table.module.css";
import { useEffect, useState } from "react";
import type { Deck } from "../types";
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
      <UnstyledButton onClick={onSort} className={classes.control}>
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

function TdText({ children }: { children: React.ReactNode }) {
  return (
    <Table.Td>
      <Text truncate="end" inherit>
        {children}
      </Text>
    </Table.Td>
  );
}

function filterData(data: Deck[], filter: string) {
  if (data.length == 0) {
    return [];
  }
  const query = filter.toLowerCase().trim();
  return data.filter((item) => item?.deck_name.toLowerCase().includes(query));
}

function sortData(
  data: Deck[],
  payload: { sortBy: keyof Omit<Deck, "id"> | null; descending: boolean; search: string }
) {
  const { sortBy, descending, search } = payload;

  if (!sortBy) {
    return filterData(data, search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return descending ? bVal - aVal : aVal - bVal;
      }

      if (aVal instanceof Date && bVal instanceof Date) {
        return descending ? bVal.getTime() - aVal.getTime() : aVal.getTime() - bVal.getTime();
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return descending ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      }

      return 0;
    }),
    search
  );
}

function DeckTable(props: {
  searchFilter: string;
  view: "grid" | "table";
  loading: boolean;
  data: Deck[];
  setData: (d: Deck[]) => void;
}) {
  const [sortBy, setSortBy] = useState<keyof Omit<Deck, "id"> | null>(null);
  const [descending, setDescending] = useState(true);
  const [sortedData, setSortedData] = useState<Deck[]>(props.data);
  const navigate = useNavigate();

  useEffect(() => {
    setSortedData(sortData(props.data, { sortBy, descending, search: props.searchFilter }));
  }, [props.searchFilter, props.loading, props.data, sortBy, descending]);

  function handleSort(field: keyof Omit<Deck, "id">) {
    const desc = field === sortBy ? !descending : true;
    setSortBy(field);
    setDescending(desc);
  }

  if (props.view === "table") {
    const rows = sortedData?.map((deck) => (
      <Table.Tr key={deck.id} className={classes.row} onClick={() => navigate(`/cards/${deck.id}`)}>
        <TdText>{deck.deck_name}</TdText>
        <TdText>{`${deck.last_reviewed.toLocaleDateString()}`}</TdText>
        <TdText>{`${deck.last_modified.toLocaleDateString()}, ${deck.last_modified.toLocaleTimeString()}`}</TdText>
        <Table.Td>{deck.size}</Table.Td>
        <Table.Td onClick={(e) => e.stopPropagation()}>
          <Group gap={0} justify="flex-end" wrap="nowrap">
            <RenameDeck deck={deck} data={props.data} setData={props.setData} />
            <DeleteDeck data={sortedData} setData={setSortedData} deck={deck} />
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

    return (
      <div style={{maxWidth: "100%", overflowX: "auto",padding: "0 1rem"}}>
        <ScrollArea>
          <LoadingOverlay visible={props.loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 3 }} />
          <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Th
                  sorted={sortBy === "deck_name"}
                  descending={descending}
                  onSort={() => handleSort("deck_name")}
                >
                  Deck Name
                </Th>
                <Th
                  sorted={sortBy === "last_reviewed"}
                  descending={descending}
                  onSort={() => handleSort("last_reviewed")}
                >
                  Last reviewed
                </Th>
                <Th
                  sorted={sortBy === "last_modified"}
                  descending={descending}
                  onSort={() => handleSort("last_modified")}
                >
                  Last modified
                </Th>
                <Th
                  sorted={sortBy === "size"}
                  descending={descending}
                  onSort={() => handleSort("size")}
                >
                  Size
                </Th>
                <Table.Th className={classes.empty} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Text fw={500} ta="center">
                      Nothing found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </div>
    );
  }
  return null;
}

export default DeckTable;
