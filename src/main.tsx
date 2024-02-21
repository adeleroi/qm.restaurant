import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { Feed, loader as FeedLoader } from './views/feed/index.tsx';
import { ErrorPage } from './views/error.tsx';
import { Home } from './views/home.tsx';
import { action as rootAction, loader as rootLoader } from './App.tsx';
import { StoreFront, action as storeFrontAction, loader as storeFrontLoader } from './views/store-front/index.tsx';
import { ProductModal, loader as ProductModalLoader, action as ProductModalAction } from './views/store-front/product-modal.tsx/index.tsx';
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
        path: "feed",
        element: <Feed/>,
        loader: FeedLoader,
      },
      {
        path: "store/:storeId",
        element: <StoreFront/>,
        action: storeFrontAction,
        loader: storeFrontLoader,

        children: [
          {
            path: "",
            element: <ProductList />,
            loader: storeFrontLoader,
            action: storeFrontAction,
            children: [
              {
                path: "product/:productId",
                element: <ProductModal/>,
                loader: ProductModalLoader,
                action: ProductModalAction,
              },
            ]
          },
          {
            path: "category/:categoryId",
            element: <FilteredProductList />,
            loader: FilteredProductLoader,
            children: [
              {
                path: "product/:productId",
                element: <ProductModal/>,
                loader: ProductModalLoader,
                action: ProductModalAction,
              },
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
