import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { Restaurant } from './views/restaurant.tsx';
import { Store } from './views/store.tsx';
import { ErrorPage } from './views/error.tsx';
import { Home } from './views/home.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "restaurant",
        element: <Restaurant/>
      },
      {
        path: "store",
        element: <Store/>
      },
    ],
  },
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
