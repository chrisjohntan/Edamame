import Root from './routes/Root.tsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import ErrorPage from './components/ErrorPage.tsx'
import Register from './routes/Register.tsx'
import Login from './routes/Login.tsx'
import Dashboard from './routes/Dashboard.tsx';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import { AuthProvider } from './context/AuthProvider.tsx';
import { Button, MantineProvider, createTheme } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import ProtectedHeader from './components/ProtectedHeader.tsx';
import CustomAppShell from './routes/CustomAppShell.tsx';
import { IconError404 } from '@tabler/icons-react';
import classes from "./App.module.css"
import MultiCardView from './components/MultiCardView.tsx';
import { ForgotPassword } from './components/ForgetPasswordForm.tsx';
import { Notifications } from '@mantine/notifications';
import Stats from './routes/Stats.tsx';

const theme = createTheme({
  // change theme settings here
  components: {
    Button: Button.extend({
      classNames: classes,
    }),
  },
})

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <>
        {/* Public routes */}
        <Route path="/" element={<Root />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recover-account" element={<ForgotPassword />} />

        {/* All protected routes should be nested here */}
        <Route element={<ProtectedRoute />}>
          <Route element={<CustomAppShell />} errorElement={<IconError404 />}>
            <Route path="/decks" element={<Dashboard />} />
            <Route path="/cards/:deckId" element={<MultiCardView />} />
            <Route path="/stats" element={<Stats/>}></Route>
          </Route>
        </Route>

        {/* Error page route */}
        <Route path="*" element={<IconError404 />} />
      </>
    </>
  )
)


function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme='light'>
      <Notifications position="bottom-right" zIndex={1001} />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </MantineProvider>
  )
}

export default App
