import React from 'react';
import { AppRoutes } from '../config';
const UserCorporate = React.lazy(
  () => import("../app/containers/UserCorporate")
);
const OurTeam = React.lazy(() => import("../app/containers/OurTeam"));

const routes = [
  { path: AppRoutes.MAIN, exact: true, name: "Home" },
  {
    path: AppRoutes.CORPORATE,
    name: "Corporate",
    component: UserCorporate,
    exact: true,
  },
  {
    path: AppRoutes.OUR_TEAM,
    name: "Our Team",
    component: OurTeam,
    exact: true,
  },
];
export default routes;
