import React, { Component } from "react";
import { AppHeaderDropdown, AppSidebarToggler } from "@coreui/react";
import {
  IDefaultHeaderProps,
  IDefaultHeaderState,
  IRootState,
  IProfileInfo,
} from "../../../interfaces";
import { Button } from "react-bootstrap";
import { Nav, Dropdown } from "react-bootstrap";
import { AppRoutes } from "../../../config";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import UserIcon from "../../../assets/avatars/user-default.svg";
import logo from "./../../../assets/img/brand-logo.png";
import { LogOutRequest, TalentLmsApiRequest } from "../../../actions";
import { Dispatch } from "redux";

class DefaultHeader extends Component<
  IDefaultHeaderProps,
  IDefaultHeaderState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      editAccess: [],
      getSubView: "",
      getSubEdit: "",
      getUniversityView: "",
      getUniversityEdit: "",
      getCorporateView: "",
      getCorporateEdit: "",
    };
  }
  componentDidMount = () => {
    // For Check Sub Admin Edit
    let getSubAdmin: any = localStorage.getItem("SubAdminCheck");
    let checkSubAdmin: any = JSON.parse(getSubAdmin);

    let getViewRoute: any;
    let getSubView: any;
    let getSubEdit: any;
    let getUniversityView: any;
    let getUniversityEdit: any;
    let getCorporateView: any;
    let getCorporateEdit: any;
    if (checkSubAdmin && checkSubAdmin.length) {
      // "SubAdminEdit" this string is for edit access
      // Note This String change for every page
      getViewRoute = checkSubAdmin.filter((e: any) => {
        return (
          e === "Sub Admin" ||
          e === "SubAdminEdit" ||
          e === "University" ||
          e === "UniversityEdit" ||
          e === "Corporate" ||
          e === "CorporateEdit"
        );
      });
      if (getViewRoute && getViewRoute.length) {
        getSubView = getViewRoute.find((e: any) => e === "Sub Admin");
        getSubEdit = getViewRoute.find((e: any) => e === "SubAdminEdit");
        getUniversityView = getViewRoute.find((e: any) => e === "University");
        getUniversityEdit = getViewRoute.find(
          (e: any) => e === "UniversityEdit"
        );
        getCorporateView = getViewRoute.find((e: any) => e === "Corporate");
        getCorporateEdit = getViewRoute.find((e: any) => e === "CorporateEdit");
      }
    } else {
      getViewRoute = "SuperAdmin";
    }
    this.setState({
      editAccess: getViewRoute,
      getSubView,
      getSubEdit,
      getUniversityView,
      getUniversityEdit,
      getCorporateView,
      getCorporateEdit,
    });
  };

  render() {
    let profileInfo: IProfileInfo = {
      firstName: "",
      lastName: "",
      email: "",
    };
    if (this.props.profileInfoReducer) {
      profileInfo = this.props.profileInfoReducer.profileInfo;
    }
    const {
      editAccess,
      getSubView,
      getSubEdit,
      getUniversityView,
      getUniversityEdit,
      getCorporateView,
      getCorporateEdit,
    } = this.state;
    return (
      <React.Fragment>
        <AppSidebarToggler className='d-lg-none' display='md' mobile />
        <div className='brand-logo d-flex align-items-center justify-content-center'>
          <img src={logo} height='45' alt='' />
          <h3 className='mt-3 ml-1 color-brand'>Coinifide</h3>
        </div>
        {/* <AppSidebarToggler className="d-md-down-none" display="lg" /> */}
        <Nav className='ml-auto' navbar>
          <AppHeaderDropdown direction='down'>
            <Dropdown>
              <Dropdown.Toggle id='dropdown-basic'>
                <img
                  src={UserIcon}
                  alt='superadmin@hogwork.com'
                  className='img-avatar menu'
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {getCorporateView === "Corporate" ||
                getCorporateEdit === "CorporateEdit" ||
                editAccess === "SuperAdmin" ? (
                  <Dropdown.Item className='add-sub-user'>
                    <Link to={AppRoutes.CORPORATE}>
                      <i className='fa fa-briefcase' /> Corporation Management
                    </Link>
                  </Dropdown.Item>
                ) : null}
                <Dropdown.Item onClick={() => this.props.onLogout()}>
                  <i className='fa fa-sign-out' /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

const mapStateToProps: any = (state: IRootState) => ({
  profileInfoReducer: state.profileInfoReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onLogout: () => {
      dispatch(LogOutRequest());
    },
    talentlms: (data: any) => {
      dispatch(TalentLmsApiRequest(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultHeader);
