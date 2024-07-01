import { AppShell, rem } from "@mantine/core";
import ProtectedHeader from "../components/ProtectedHeader";
import { Outlet } from "react-router-dom";
import ProtectedSidebar from "../components/ProtectedSidebar";
import { useDisclosure } from "@mantine/hooks";

function CustomAppShell() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      // header={{ height: 60 }}
      navbar={{
        width: rem(200),
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="lg"
    >
      <ProtectedSidebar />
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default CustomAppShell;