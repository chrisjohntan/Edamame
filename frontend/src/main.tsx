import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './routes/Root.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './components/ErrorPage.tsx'
import Register from './routes/Register.tsx'
import Login from './routes/Login.tsx'
import Dashboard from './routes/Dashboard.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import ProtectedRoute from './routes/ProtectedRoute.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: "/signup",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute/>,
    children: [{path: "", element: <Dashboard/>}] 
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
