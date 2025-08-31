import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navber from './components/Navber';
import Home from './components/Home';
import Paste from './components/Paste';
import Viewpaste from './components/Viewpaste';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <Navber />
        <Home />
      </div>
    ),
  },
  {
    path: '/paste',
    element: (
      <div>
        <Navber />
        <Paste />
      </div>
    ),
  },
  {
    path: '/paste/:id',
    element: (
      <div>
        <Navber />
        <Viewpaste />
      </div>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
