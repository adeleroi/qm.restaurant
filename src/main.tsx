import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { Restaurant, } from './views/restaurant.tsx';
import { StoreList, loader as StoreListLoader } from './views/store-list.tsx';
import { ErrorPage } from './views/error.tsx';
import { Home } from './views/home.tsx';
import { action as rootAction, loader as rootLoader } from './App.tsx';
import { StoreFront, action as storeFrontAction, loader as storeFrontLoader } from './views/store-front/index.tsx';
import { ProductModal, loader as ProductModalLoader } from './views/store-front/product-modal.tsx/index.tsx';
import { FilteredProductList, loader as FilteredProductLoader } from './views/store-front/product-list-filtered-category/index.tsx';
import { ProductList } from './views/store-front/product-list/index.tsx';


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
        path: "restaurant",
        element: <Restaurant/>,
        // loader: RestaurantLoader,
      },
      {
        path: "store",
        element: <StoreList/>,
        loader: StoreListLoader,
      },
      {
        path: "store/:storeId",
        element: <StoreFront/>,
        action: storeFrontAction,
        loader: storeFrontLoader,

        children: [
          {
            index: true,
            element: <ProductList />,
            loader: storeFrontLoader,
            action: storeFrontAction,
          },
          {
            path: "category/:categoryId",
            element: <FilteredProductList />,
            loader: FilteredProductLoader,
          },
          {
            path: "product/:productId",
            element: <ProductModal/>,
            loader: ProductModalLoader,
          },
        ]
      },
    ],
  },
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
