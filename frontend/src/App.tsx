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
import MultiCardView from './components/MultiCardView.tsx';
import { ForgotPassword } from './components/ForgetPasswordForm.tsx';

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
        <Route path="/recover-account" element={<ForgotPassword />}/>

        {/* All protected routes should be nested here */}
          <Route element={<ProtectedRoute/>}>
            <Route element={<CustomAppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cards/:deckId" element={<MultiCardView/>}/>
            </Route>
          </Route>
          
        {/* Error page route */}
        <Route path="*" element={<IconError404/>} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
    </MantineProvider>
  )
}

export default App
