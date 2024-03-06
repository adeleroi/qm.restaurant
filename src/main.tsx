import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { Feed } from './views/feed/index.tsx';
import { ErrorPage } from './views/error.tsx';
import { Home } from './views/home/home.tsx';
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
import { FoodModal } from './views/restaurant/food-modal/index.tsx';
import { FoodModalLoader } from './views/restaurant/food-modal/loader.ts';
import { FoodModalAction } from './views/restaurant/food-modal/action.ts';
import { HomeAction } from './views/home/action.tsx';
import { AppAction } from './App-action/index.ts';
import { AppLoader } from './App-loader/index.ts';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    // errorElement: <ErrorPage/>,
    action: AppAction,
    loader: AppLoader,
    id: 'root',
    children: [
      {
        index: true,
        element: <Home/>,
        // action: HomeAction,
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
        children: [
          {
            path: "food/:foodId",
            element: <FoodModal />,
            loader: FoodModalLoader,
            action: FoodModalAction,
          }
        ]
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
