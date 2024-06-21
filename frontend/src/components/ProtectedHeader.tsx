import { Outlet, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { AppShell, AppShellHeader, Box, Button, Group } from "@mantine/core";
import edamameLogo from "../assets/edamame.svg"


function ProtectedHeader() {

  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/')
  }

  return (
    <>
      <AppShell.Header>
          <Group h="100%" px="md" justify="space-between" >
            {/* <MantineLogo size={30} /> */}
            <Group>
              <img src={edamameLogo} style={{width: "1rem", height: "1rem"}}/>
              <h2>Edamame</h2>
            </Group>
            <Button mt="" onClick={signOut}>
              Sign Out
            </Button>
          </Group>
      </AppShell.Header>
      {/* <Outlet /> */}
    </>
  )

}

export default ProtectedHeader;