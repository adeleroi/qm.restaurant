import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { Feed, Restaurant } from './views/feed/index.tsx';
import { ErrorPage } from './views/error.tsx';
import { Home } from './views/home.tsx';
import { action as rootAction, loader as rootLoader } from './App.tsx';
import { StoreFront } from './views/store-front/index.tsx';
import { ProductModal } from './views/store-front/product-modal.tsx/index.tsx';
import { ProductListFilteredByCategory } from './views/store-front/product-list-filtered-category/index.tsx';
import { ProductList } from './views/store-front/product-list/index.tsx';
import { storeFrontAction } from './views/store-front/action.ts';
import { storeFrontLoader } from './views/store-front/loader.ts';
import { ProductModalLoader } from './views/store-front/product-modal.tsx/loader.ts';
import { FilteredByCategoryProductLoader } from './views/store-front/product-list-filtered-category/loader.ts';
import { Feedloader } from './views/feed/loader.ts';
import { RestaurantFront } from './views/restaurant/index.tsx';
import { RestaurantLoader } from './views/restaurant/loader.ts';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    action: rootAction,
    loader: rootLoader,
    id: 'root',
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "feed",
        element: <Feed/>,
        loader: Feedloader,
        id: "feed",
      },
      {
        path: "restaurant/:restaurantId",
        element: <RestaurantFront/>,
        loader: RestaurantLoader,
        id: "restaurant",
      },
      {
        path: "store/:storeId",
        element: <StoreFront/>,
        action: storeFrontAction,
        loader: storeFrontLoader,
        id: "store",
        children: [
          {
            index: true,
            element: <ProductList />,
            loader: storeFrontLoader,
          },
          {
            path: "product/:productId",
            element: <ProductModal/>,
            loader: ProductModalLoader,
          },
          {
            path: "category/:categoryId",
            element: <ProductListFilteredByCategory />,
            loader: FilteredByCategoryProductLoader,
            children: [
              {
                path: "product/:productId",
                element: <ProductModal/>,
                loader: ProductModalLoader,
              }
            ]
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
