import { useState } from 'react';
import { Container, Anchor, Group, Burger, Box, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import classes from './styles/HomeNavbar.module.css';
import edamameLogo from "../assets/edamame.png"


export function UnprotectedNavbar() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  return (
    <header className={classes.header}>
      <Container className={classes.inner}>
        {/* <MantineLogo size={34} /> */}
        <Group>
          <img src={edamameLogo} style={{width: "3rem", height: "3rem"}}/>
          <h1>Edamame</h1>
        </Group>
        <Box className={classes.links} visibleFrom="sm">
          {/* <Group justify="flex-end">{secondaryItems}</Group> */}
          {/* <Group gap={0} justify="flex-end" className={classes.mainLinks}> */}
            {/* {mainItems} */}
          {/* </Group> */}
        </Box>

        <Group visibleFrom="sm">
            <Button variant="default" onClick={()=>navigate("/login")}>Log in</Button>
            <Button onClick={()=>navigate("/signup")}>Sign up</Button>
        </Group>
        {/* <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
        </Group> */}
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
          hiddenFrom="sm"
        />
      </Container>
    </header>
  );
}

export default UnprotectedNavbar;