import React from "react";
import Layout from "../layout";
import { AppRoutes } from "./AppRoutes";
const Home = React.lazy(() => import("../views/pages/home"));
const TabComponent = React.lazy(() => import("../views/pages/tabs"));

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
    key: "tabs",
    path: AppRoutes.TABS,
    exact: true,
    name: "tabs",
    component: TabComponent,
    layout: Layout,
  },
];
