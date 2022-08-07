import React from "react";
import Layout from "../layout";
import { AppRoutes } from "./AppRoutes";
const Home = React.lazy(() => import("../views/pages/home"));
const BookList = React.lazy(() => import("../views/pages/book-list"));

export const routes = [
  {
    key: "home",
    path: AppRoutes.HOME,
    exact: true,
    name: "home",
    component: Home,
    layout: Layout,
  },
  {
    key: "bookList",
    path: AppRoutes.BOOK_LIST,
    exact: true,
    name: "bookList",
    component: BookList,
    layout: Layout,
  },
];
