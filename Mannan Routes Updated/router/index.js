import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { createBrowserHistory as createHistory } from 'history'
// import { Provider } from 'react-redux'
import { publicRoutes, privateRoutes } from './routerConfig'

import ErrorBoundary from "./ErrorBoundary";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import Loader from 'components/shared/loader/Loader'
import ConfirmDialog from 'components/shared/common-dialog'

const theme = createTheme({
  palette: {
    primary: {
      main: "#EA3F3F"
    },
    secondary: {
      main: "#262933"
    }
  },
  typography: {
    fontSize: 12,
    fontFamily: ["Poppins", "sans-serif"].join(",")
  }
});

const Main = () => {
  const history = createHistory()
  history.listen(_=> {
    window.scrollTo(0,0)
  })
  return (
    <ThemeProvider theme={theme}>
      <Loader />
      <ConfirmDialog />
      <Router>
        <ErrorBoundary>
          <Routes>
              {privateRoutes.map(({ layout: PrivateLayout, component: Component, ...restProps }) => (
                <Route 
                  {...restProps}
                  element={
                    <PrivateLayout>
                      <Component {...history} />
                    </PrivateLayout>
                  }
                />
              ))}
              {publicRoutes.map(({ layout: PublicLayout, component: Component, ...restProps }) => (
                <Route 
                  {...restProps}
                  element={
                    <PublicLayout>
                      <Component {...history} />
                    </PublicLayout>
                  }
                />
              ))}
            <Route path='*' element={ <Navigate replace to='/login' /> } />
          </Routes>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  )
}

export default Main