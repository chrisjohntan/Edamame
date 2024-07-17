import { AppShell, Code, Group, NavLink } from "@mantine/core";
import classes from './styles/Sidebar.module.css';
import { IconCards, IconChartArea, IconChartBar, IconLogout, IconSettings, IconSwitchHorizontal, IconUser } from '@tabler/icons-react';
import { useState } from "react";
import useLogout from "../hooks/useLogout";
import { useLocation, useNavigate } from "react-router-dom";
import edamameLogo from "../assets/edamame.svg"


function ProtectedSidebar() {
  const data = [
    { link: '/decks', label: 'Decks', icon: IconCards },
    { link: '/stats', label: 'Stats', icon: IconChartBar },
    // { link: '/settings', label: 'Settings', icon: IconSettings}
  ];

  const [active, setActive] = useState('Decks');
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const signOut = () => {
    logout();
    navigate("/");
  }

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        navigate(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));


  return (
    <AppShell.Navbar px="md">
      <nav className={classes.navbar}>
        <div className={classes.navbarMain}>
          <Group className={classes.header}>
            <img src={edamameLogo} style={{ width: "1rem", height: "1rem" }} />
            <h2>Edamame</h2>
          </Group>
          {links}
        </div>

        <div className={classes.footer}>
          <a href="/settings" className={classes.link}
            onClick={(event) => {
              event.preventDefault();
              navigate("/settings");
            }}
          >
            <IconSettings className={classes.linkIcon} stroke={1.5} />
            <span>Settings</span>
          </a>

          <a href="/logout" className={classes.link}
            onClick={(event) => {
              event.preventDefault();
              signOut()
            }}
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </AppShell.Navbar>
  )
}

export default ProtectedSidebar;