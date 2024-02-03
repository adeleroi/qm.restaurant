import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { Restaurant } from './views/restaurant.tsx';
import { StoreList } from './views/store-list.tsx';
import { ErrorPage } from './views/error.tsx';
import { Root } from './views/home.tsx';
import { action as rootAction } from './App.tsx';
import { StoreFront, action as storeFrontAction, loader as storeFrontLoader } from './views/store-front.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    action: rootAction,
    children: [
      {
        index: true,
        element: <Root/>
      },
      {
        path: "restaurant",
        element: <Restaurant/>
      },
      {
        path: "store",
        element: <StoreList/>
      },
      {
        path: "store/:storeId",
        element: <StoreFront/>,
        action: storeFrontAction,
        loader: storeFrontLoader,
      },
    ],
  },
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
