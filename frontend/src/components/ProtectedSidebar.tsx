import { AppShell, Group } from "@mantine/core";
import classes from './styles/Sidebar.module.css';
import { IconCards, IconLogout, IconSwitchHorizontal } from '@tabler/icons-react';
import { useState } from "react";


function ProtectedSidebar() {
  const data = [
    { link: '', label: 'Decks', icon: IconCards },
  ];

  const [active, setActive] = useState('Decks');

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));


  return (
    <AppShell.Navbar p="md">
      <nav className={classes.navbar}>
        <div className={classes.navbarMain}>
          {links}
        </div>

        <div className={classes.footer}>
          <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
            <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
            <span>Change account</span>
          </a>

          <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </AppShell.Navbar>
  )
}

export default ProtectedSidebar;