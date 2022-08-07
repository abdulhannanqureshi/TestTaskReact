import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { createBrowserHistory as createHistory } from "history";
import { routes } from "./Router";
import { GlobalLoader } from "../helper/CommonServices";

const Routing = () => {
  const history = createHistory();
  return (
    <Router>
      <React.Suspense fallback={"GlobalLoader"}>
        <Routes>
          {routes.map(
            ({ layout: Layout, component: Component, ...restProps }) => (
              <Route
                {...restProps}
                element={
                  <Layout>
                    {/* <Component history={history} /> */}
                    <Component />
                  </Layout>
                }
              />
            )
          )}
          <Route path='*' element={<Navigate replace to={AppRoutes.HOME} />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default Routing;
