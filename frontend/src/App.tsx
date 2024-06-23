import Root from './routes/Root.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorPage from './components/ErrorPage.tsx'
import Register from './routes/Register.tsx'
import Login from './routes/Login.tsx'
import Dashboard from './routes/Dashboard.tsx';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import { AuthProvider } from './context/AuthProvider.tsx';
import { AppShell, Button, MantineProvider, createTheme, rem } from '@mantine/core';

import '@mantine/core/styles.css';
import ProtectedHeader from './components/ProtectedHeader.tsx';
import CustomAppShell from './routes/CustomAppShell.tsx';
import { IconError404 } from '@tabler/icons-react';
import classes from "./App.module.css"

const theme = createTheme({
  // change theme settings here
  components: {
    Button: Button.extend({
      classNames: classes,
    }),
  },
})


function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme='light'>
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Root />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* All protected routes should be nested here */}
        {/* Wrap in AppShell */}
        {/* <AppShell> */}
          <Route element={<ProtectedRoute/>}>
            <Route element={<CustomAppShell />}>
            {/* <ProtectedHeader /> */}
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>

        {/* </AppShell> */}

        {/* Error page route */}
        <Route path="*" element={<IconError404/>} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
    </MantineProvider>
  )
}

export default App
