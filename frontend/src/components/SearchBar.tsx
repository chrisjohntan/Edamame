import { TextInput, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Dispatch, SetStateAction } from "react";


function SearchBar(props: {searchFilter: string, placeholder: string, onSearchFilterChange: Dispatch<SetStateAction<string>>}) {
  return (
    <TextInput
      placeholder={props.placeholder}
      leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
      value={props.searchFilter}
      onChange={e=>props.onSearchFilterChange(e.currentTarget.value)}
      style={{flexGrow:1}}
    />
  )
}

export default SearchBar;