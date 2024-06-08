import Root from './routes/Root.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorPage from './components/ErrorPage.tsx'
import Register from './routes/Register.tsx'
import Login from './routes/Login.tsx'
import Dashboard from './routes/Dashboard.tsx';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import { AuthProvider } from './context/AuthProvider.tsx';
import { MantineProvider, createTheme, rem } from '@mantine/core';

import '@mantine/core/styles.css';

const theme = createTheme({
  // change theme settings here
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
        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Error page route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
    </MantineProvider>
  )
}

export default App
