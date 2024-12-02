import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Volunteers from './pages/Volunteers';
import Events from './pages/Events';
import Chat from './pages/Chat';
import Canvassing from './pages/Canvassing';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/volunteers",
    element: (
      <PrivateRoute>
        <Layout>
          <Volunteers />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/events",
    element: (
      <PrivateRoute>
        <Layout>
          <Events />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <PrivateRoute>
        <Layout>
          <Chat />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/canvassing",
    element: (
      <PrivateRoute>
        <Layout>
          <Canvassing />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;