import { TextInput, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Dispatch, SetStateAction } from "react";


function SearchBar(props: {searchFilter: string, onSearchFilterChange: Dispatch<SetStateAction<string>>}) {
  return (
    <TextInput
      placeholder="Search deck"
      mb="md"
      leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
      value={props.searchFilter}
      onChange={e=>props.onSearchFilterChange(e.currentTarget.value)}
    />
  )
}

export default SearchBar;