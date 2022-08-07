import React from "react";
import Layout from "../layout";
import { AppRoutes } from "./AppRoutes";
const Home = React.lazy(() => import("../views/pages/home"));
const Service = React.lazy(() => import("../views/pages/service"));
const Checkout = React.lazy(() => import("../views/pages/checkout"));

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
    key: "service",
    path: `${AppRoutes.SERVICES}/:slug`,
    exact: true,
    name: "service",
    component: Service,
    layout: Layout,
  },
  {
    key: "checkout",
    path: `${AppRoutes.CHECKOUT}/:service_id/:tier_id/:slug`,
    exact: true,
    name: "checkout",
    component: Checkout,
    layout: Layout,
  },
];
