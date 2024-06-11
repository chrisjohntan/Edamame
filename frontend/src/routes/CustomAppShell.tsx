import { AppShell, rem } from "@mantine/core";
import ProtectedHeader from "../components/ProtectedHeader";
import { Outlet } from "react-router-dom";
import ProtectedSidebar from "../components/ProtectedSidebar";

function CustomAppShell() {
  return (
    <AppShell header={{ height: 60 }}
      navbar={{
        width: rem(200),
        breakpoint: 'sm',
      }}
      padding="md">
      <ProtectedHeader />

      <ProtectedSidebar />

      <AppShell.Main>
        <Outlet></Outlet>
      </AppShell.Main>
    </AppShell>
  )
}

export default CustomAppShell;