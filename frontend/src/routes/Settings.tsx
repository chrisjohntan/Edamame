import { Button, Container, Tabs, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

const AccountTab = () => {
  const { auth, setAuth } = useAuth();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      username: auth.user.username,
      email: auth.user.email
    }
  });
  return (
    <Container py="lg" px="md">
      <header style={{marginBottom: "var(--mantine-spacing-md)"}}>
        Account details
      </header>
      <form>

        <TextInput mb="md" label="Username" placeholder="" autoComplete="off" key={form.key("username")}
          {...form.getInputProps('username')} required />
        <TextInput mb="md" label="Email" placeholder="" autoComplete="off" key={form.key("email")}
          {...form.getInputProps('email')} required />
        <Button>
          Save changes
        </Button>
      </form>
    </Container>
  )
}

// const SecurityTab = () => {
//   const 
//   return (
//     <Container py="lg" px="md">
//       <header style={{marginBottom: "var(--mantine-spacing-md)"}}>
//         Password
//       </header>
//       <Button>
//         Change password
//       </Button>
//     </Container>
//   )
// }




function Settings() {
  const [activeTab, setActiveTab] = useState<string | null>('account');
  console.log(activeTab)
  return (
    <main>
      <Title mb="xl">
        Settings
      </Title>
      <Tabs value={activeTab} onChange={setActiveTab} color="teal">
      <Tabs.List>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        {/* <Tabs.Tab value="security">Security</Tabs.Tab>
        <Tabs.Tab value="preferences">Preferences</Tabs.Tab> */}
      </Tabs.List>
      <Tabs.Panel value="account">
        <AccountTab/>
      </Tabs.Panel>
      {/* <Tabs.Panel value="security">
        Security
      </Tabs.Panel>
      <Tabs.Panel value="preferences">
        Preferences
      </Tabs.Panel> */}
    </Tabs>
    </main>
  )
}

export default Settings;