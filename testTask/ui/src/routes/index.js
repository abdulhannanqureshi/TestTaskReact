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

const Routing = () => {
  const history = createHistory();
  return (
    <Router>
      <React.Suspense fallback={"loading"}>
        <Routes>
          {routes.map(
            ({ layout: Layout, component: Component, ...restProps }) => (
              <Route
                {...restProps}
                element={
                  <Layout>
                    <Component history={history} />
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
