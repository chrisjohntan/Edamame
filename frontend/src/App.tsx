import { lazy, Suspense } from 'react';
import Root from './routes/Root.tsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.tsx';
// import Register from './routes/Register.tsx'
const Register = lazy(() => import("./routes/Register.tsx"))
// import Login from './routes/Login.tsx'
const Login = lazy(() => import('./routes/Login.tsx'))
// import Dashboard from './routes/Dashboard.tsx';
const Dashboard = lazy(() => import('./routes/Dashboard.tsx'))
// import ProtectedRoute from './routes/ProtectedRoute.tsx';
const ProtectedRoute = lazy(() => import('./routes/ProtectedRoute.tsx'))
// import CustomAppShell from './routes/CustomAppShell.tsx';
const CustomAppShell = lazy(() => import('./routes/CustomAppShell.tsx'))
// import Stats from './routes/Stats.tsx';
const Stats = lazy(() => import('./routes/Stats.tsx'))
// import Settings from './routes/Settings.tsx';
const Settings = lazy(() => import('./routes/Settings.tsx'))
// import MultiCardView from './components/MultiCardView.tsx';
const MultiCardView = lazy(() => import('./components/MultiCardView.tsx'))
// import ForgetPassword from './components/ForgetPasswordForm.tsx';
const ForgetPassword = lazy(() => import('./components/ForgetPasswordForm.tsx'))
// import ResetPassword from './components/ResetPassword.tsx';
const ResetPassword = lazy(() => import('./components/ResetPassword.tsx'))

import { Button, MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { IconError404 } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import classes from "./App.module.css"

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
        <Route path="/signup" element={<Suspense><Register /></Suspense>} />
        <Route path="/login" element={<Suspense><Login /></Suspense>} />
        <Route path="/forgot_password" element={<Suspense><ForgetPassword /></Suspense>} />
        <Route path="/reset/:email/:token" element={<Suspense><ResetPassword /></Suspense>} />

        {/* All protected routes should be nested here */}
        <Route element={<Suspense><ProtectedRoute /></Suspense>}>
          <Route element={<Suspense><CustomAppShell /></Suspense>} errorElement={<IconError404 />}>
            <Route path="/decks" element={<Suspense><Dashboard /></Suspense>} />
            <Route path="/cards/:deckId" element={<Suspense><MultiCardView /></Suspense>} />
            <Route path="/stats" element={<Suspense><Stats /></Suspense>} />
            <Route path="/settings" element={<Suspense><Settings /></Suspense>}/>
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
      <Notifications position="bottom-right" zIndex={1001} autoClose={10000}/>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </MantineProvider>
  )
}

export default App
