import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import {
  IDefaultLayoutProps,
  IDefaultLayoutState,
  IRootState,
  IredirectPath,
} from '../../../interfaces';
import { AppRoutes } from '../../../config/AppRoutes';
import routes from '../../../routes/routes';
// sidebar nav config
import navigation from '../../../_nav';
import Loader from '../../components/Loader/Loader';
import {
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
import { profileInfoRequest, redirectTo } from '../../../actions';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component<
  IDefaultLayoutProps,
  IDefaultLayoutState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: true,
      isAuthenticated: true,
      userDetails: {},
      checkSubAdmin:[],
      updateNavigate:{items: []},
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('token')) {
      this.props.redirectTo({ path: AppRoutes.LOGIN });
    } else {
      this.props.profileInfo();
    }
  }

  isSubAdmin = (nav:any) => {
    let getSubAdmin:any =  localStorage.getItem('SubAdminCheck')
    if(getSubAdmin) {
      let checkSubAdmin:any = JSON.parse(getSubAdmin);
      // For Check Sub Admin
      if (checkSubAdmin.length) {
        let getViewRoute:any;
        getViewRoute = nav.items.filter(
          (e: any) =>
            checkSubAdmin.includes(e.name) ||
            checkSubAdmin.includes(e.innerPage)
        );
        let getDashboard = getViewRoute.filter(
          (e: any) => e.name === "Dashboard"
        );
        if (getDashboard.length === 0) {
          getViewRoute.sort((a: any, b: any) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
        }
        return {items: getViewRoute}
      } else {
        return nav
      }
    }
    return nav
  }

  isSubRoute = (nav:any) => {
    // let getSubAdmin:any =  localStorage.getItem('SubAdminCheck')
    // if(getSubAdmin) {
    //   let checkSubAdmin:any = JSON.parse(getSubAdmin);
    //   // For Check Sub Admin
    //   if (checkSubAdmin.length) {
    //     let getViewRoute:any;
    //     getViewRoute = nav.items.filter(
    //       (e: any) =>
    //       checkSubAdmin.includes(e.name) ||
    //       checkSubAdmin.includes(e.innerPage)
    //       );
    //     let getDashboard = getViewRoute.filter(
    //       (e: any) => e.name === "Dashboard"
    //     );
    //     if (getDashboard.length === 0) {
    //       getViewRoute.sort((a: any, b: any) => {
    //         if (a.name < b.name) return -1;
    //         if (a.name > b.name) return 1;
    //         return 0;
    //       });
    //     }
    //     const childrenPaths = getViewRoute.map((item:any) => ({children: item.children ? [...item.children.map((e:any) => e.url)] : [item.url]} ) ).map((e:any) => e.children)
    //     const paths:any = [].concat(...childrenPaths)
    //     let getRoutes:any = routes.filter((e) => paths.includes(e.path))
    //     return getRoutes
    //   } else {
    //     return routes
    //   }
    // }
    return routes;
  }


  componentDidUpdate = async (prevProps: RouteComponentProps) => {
    const { location } = this.props;
    const { pathname } = location;
    const { profileInfoReducer } = this.props;
    if (
      prevProps.location.pathname !== pathname &&
      profileInfoReducer &&
      localStorage.getItem('token')
    ) {
      this.props.profileInfo();
    }
  };


  render() {
    return (
      <div className='app'>
        <AppHeader fixed>
          <Suspense fallback={<Loader />}>
            <DefaultHeader {...this.props} />
          </Suspense>
        </AppHeader>
        <div className='app-body'>
          <AppSidebar fixed display='lg'>
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense fallback={<Loader />}>
              <AppSidebarNav navConfig={this.isSubAdmin(navigation)} {...this.props} isOpen />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className='main'>
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid>
              <Suspense fallback={<Loader />}>
                <Switch>
                  {routes.map(({component: Component, ...route}:any, idx:any) => {
                    return Component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        // component={route.component}
                        render={(routeRenderProps:any) =>
                          this.isSubRoute(navigation).map((itm:any) => itm.path).includes(route.path) ? (
                              <Component {...routeRenderProps} />
                          ) : (
                            <Redirect
                              to={{
                                pathname: this.isSubRoute(navigation)[0].path,
                                state: { from: routeRenderProps.location }
                              }}
                            />
                          )}

                      />
                      ) : null;
                    })}
                  <Redirect from={AppRoutes.MAIN} to={AppRoutes.HOME} />
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
        <AppFooter>
          <Suspense fallback={<Loader />}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

const mapStateToProps: any = (state: IRootState) => ({
  loginReducer: state.loginReducer,
  profileInfoReducer: state.profileInfoReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    profileInfo: () => {
      dispatch(profileInfoRequest());
    },
    redirectTo: (data: IredirectPath) => {
      dispatch(redirectTo(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DefaultLayout);
