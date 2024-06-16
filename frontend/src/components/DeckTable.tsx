import { Text, Table, UnstyledButton, Group, Center, rem, ScrollArea } from "@mantine/core";
import { IconChevronUp, IconChevronDown, IconSelector } from "@tabler/icons-react";
import classes from '.styles/.module.css';
import { useState } from "react";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
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

function filterData(data, filter: string)

function DeckTable(props: {}) {
  const [sortBy, setSortBy] = useState()

  return (
    <ScrollArea type="hover">

    </ScrollArea>
  )
}

export default DeckTable;