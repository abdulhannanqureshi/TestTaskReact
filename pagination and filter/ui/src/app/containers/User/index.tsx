import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import {
  IRootState,
  IUserProps,
  IUserState,
  IUserData,
} from "../../../interfaces";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as qs from "query-string";
import { ConfirmBox } from "../../../helper";
// import TooltipComponent from "../../components/ToolTipComponent";
import { paginationLimit } from "../../common/constant";
import {
  Table,
  Button,
  Card,
  Form,
  InputGroup,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import PaginationComponent from "../../components/Pagination";
// import { Camera } from "react-feather";
import {
  getUserRequest,
  userStatusRequest,
  userDeleteRequest,
  bulkUserActionRequest,
  redirectTo,
  getUserReportRequest
} from "../../../actions";
import { AppRoutes } from "../../../config";
import { Trash2, Edit } from "react-feather";
import { toast } from "react-toastify";

class User extends Component<IUserProps, IUserState> {
  constructor(props: IUserProps) {
    super(props);
    this.state = {
      // For Pagination
      totalRecords: 0,
      currentPage: 1,
      pageNeighbours: 1,
      selectedUser: [],
      // search
      search: "",
      status: "",
      editAccess: "",
      minusSign: false,
      checkboxStatus: true
    };
  }

  componentDidMount = () => {
    //this.props.getUsers();
    this.handleQueryParams();

    // For Check Sub Admin Edit
    let getSubAdmin: any = localStorage.getItem("SubAdminCheck");
    let checkSubAdmin: any = JSON.parse(getSubAdmin);
    let getViewRoute: any;
    if (checkSubAdmin.length) {
      // "UserEdit" this string is for edit access
      // Note This String change for every page
      getViewRoute = checkSubAdmin.find((e: any) => e === "UserEdit");
    } else {
      getViewRoute = "SuperAdmin";
    }
    this.setState({
      editAccess: getViewRoute,
    });
  };

  componentDidUpdate = (prevProps: any) => {
    const { location } = prevProps;
    if (location.search !== this.props.location.search) {
      this.handleQueryParams();
    }
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value,
    });
  };

  handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      ...this.state,
      status: event.target.value,
    });
    this.handleQueryParams();
  };

  handleQueryParams = () => {
    const {
      location: { search },
    } = this.props;
    const query = qs.parse(search);
    let searchValue: any;
    let page: number = 1;
    // let status: any = null;
    if (query) {
      page = query.page ? parseInt(query.page as string) : 1;
      searchValue = query.searchValue || "";
      // status = query.status ? query.status : "";
    }
    this.setState(
      {
        currentPage: query.page ? parseInt(query.page as string) : 1,
        search: searchValue,
      },
      () =>
        this.props.getUsers({
          searchValue: searchValue,
          skip: page,
          limit: paginationLimit,
          isActive: query.status ? query.status : this.state.status,
        })
    );
  };

  // To apply search filter on list
  handleSearchSubmit = (event: any) => {
    event.preventDefault();
    const {
      location: { pathname },
    } = this.props;
    // To push data in query param
    let params: any = {};
    params.page = 1;
    const { search, status } = this.state;

    if (search) {
      params.searchValue = search;
    }
    if (status && status.value !== "") {
      params.status = status.value;
    }
    if (this.props.redirectTo) {
      this.props.redirectTo({
        path: [pathname, qs.stringify(params)].join("?"),
      });
    }
  };

  onPageChanged = (page: number) => {
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    if (this.props.redirectTo) {
      this.props.redirectTo({
        path: [pathname, qs.stringify({ ...query, page: page })].join("?"),
      });
    }
  };

  handleAllCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { checked } = target;

    const { userReducer } = this.props;
    const selectedUser: any = [];
    if (
      userReducer &&
      userReducer.userData &&
      userReducer.userData.length &&
      checked
    ) {
      const { userData } = userReducer;
      userData.forEach((user: any) => {
        selectedUser.push(user._id);
      });
    }
    this.setState({
      selectedUser,
      minusSign: false,
      checkboxStatus: checked ? false : true
    });
  };

  handleSingleCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const { target } = event;
    const { checked } = target;
    let selectedUser = [...this.state.selectedUser];
    const { userReducer } = this.props;
    if (checked) {
      selectedUser = [...selectedUser, id];
    } else {
      let index = selectedUser.indexOf(id);
      if (index > -1) {
        selectedUser = selectedUser.filter((user: string) => user !== id);
      }
    }
    this.setState({
      selectedUser,
    }, () => {///for minus sign inside the checkbox after single check.
      if (this.state.selectedUser.length) {
        this.setState(
          {
            ...this.state,
            selectedUser: selectedUser,
            minusSign: true,
            checkboxStatus: false
          }
        )
      }
      else {
        this.setState(
          {
            ...this.state,
            selectedUser: selectedUser,
            minusSign: false,
            checkboxStatus: true
          }
        )
      }
    });
  };

  handleStatus = async (id: string, isActive: boolean) => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: isActive
        ? "Do you want to activate this user?"
        : "Do you want to deactivate this user?",
      confirmButtonText: isActive ? `Yes, activate!` : `Yes, deactivate!`,
    });
    if (!value) {
      return;
    } else {
      const {
        location: { search },
      } = this.props;
      const query = qs.parse(search);
      let page: number = 1;
      if (query) {
        page = query.page ? parseInt(query.page as string) : 1;
      }
      this.props.updateUserStatus({
        id,
        isActive,
        skip: page,
        limit: paginationLimit,
      });
    }
  };

  handleDelete = async (id: string, isActive: boolean) => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: "Do you want to delete this user?",
      confirmButtonText: "Yes, delete!",
    });
    if (!value) {
      return;
    } else {
      const {
        location: { search },
      } = this.props;
      const query = qs.parse(search);
      let page: number = 1;
      if (query) {
        page = query.page ? parseInt(query.page as string) : 1;
      }
      await this.props.deleteUser({ id, skip: page, limit: paginationLimit });
    }
  };

  handleReset = () => {
    this.setState({
      status: "",
    });
    const {
      location: { pathname },
    } = this.props;
    this.props.history.push(pathname);
  };

  bulkAction = async (action: any) => {
    const { selectedUser } = this.state;
    let msg = "Do you want to delete this selected user!";
    let confirmButtonText = "Yes, delete!"
    if (action === "Active") {
      msg = "Do you want to  change status active of this selected user!";
      confirmButtonText = "Yes, activate!"
    }
    if (action === "Deactive") {
      msg = "Do you want to  change status deactive of this selected user!";
      confirmButtonText = "Yes, deactivate!"
    }
    if (selectedUser.length === 0) {
      toast.error("Please select user");
      return false;
    }
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: msg,
      confirmButtonText: confirmButtonText
    });
    if (!value) {
      return;
    } else {
      const {
        location: { search },
      } = this.props;
      const query = qs.parse(search);
      let page: number = 1;
      if (query) {
        page = query.page ? parseInt(query.page as string) : 1;
      }
      this.props.bulkAction({
        ids: selectedUser,
        type: action,
        skip: page,
        limit: paginationLimit,
      });
    }
  };

  render() {
    const { selectedUser, search, editAccess } = this.state;
    const {
      userReducer: { userData = [], totalRecords, currentPage },
    } = this.props;
    let count = (currentPage - 1) * paginationLimit + 1;

    return (
      <div>
        <Card className={"mb-0"}>
          <Card.Body className={""}>
            <Row className={"page-header-panel"}>
              {/* <Col xl='1' lg='2' md='2' sm='2'>
                <h3 className={"page-header"}>Users</h3>
              </Col> */}

              <Col xl='5' lg='6' md='6' sm='12' className='margin_sm_top'>
                <div className={"d-flex"}>
                  <InputGroup className=''>
                    <FormControl
                      placeholder='Search first name/ last name/ email/ user type'
                      aria-label='Search user'
                      name={"search"}
                      value={search}
                      onChange={this.handleChange}
                      className='modified_placeholders'
                    />
                    <Button
                      variant='primary'
                      id='button-addon2'
                      onClick={this.handleSearchSubmit}
                      className={"mr-2"}
                    >
                      Search
                    </Button>
                    <Button
                      variant='outline-secondary'
                      id='button-addon2'
                      onClick={this.handleReset}
                    >
                      Reset
                    </Button>
                  </InputGroup>
                </div>
              </Col>
              <Col xl='3' lg='6' md='6' sm='7' className='margin_sm_top mt-2 mt-md-0'>
                <div className={"filter-block justify-content-md-start justify-content-start"}>
                  <label className={"pt-2 mr-2"}>Status:</label>
                  <Form.Control
                    as='select'
                    custom
                    onChange={this.handleStatusChange}
                    name={"status"}
                    value={this.state.status}
                  >
                    <option value=''>All</option>
                    <option value='true'>Active</option>
                    <option value='false'>Inactive</option>
                  </Form.Control>
                </div>
              </Col>
              <Col
                xl='4'
                lg='12'
                md='12'
                sm='5'
                className=' d-flex justify-content-end margin_sm_top mt-2 mt-xl-0'
              >
                <Button
                  id='button-addon2'
                  onClick={this.props.getUserReport}
                  className={"download_button mr-3"}
                >
                  Download csv{" "}
                  <span className='ml-2'>
                    <i className='fa fa-download' aria-hidden='true'></i>
                  </span>
                </Button>
                {editAccess === "UserEdit" ||
                  editAccess === "SuperAdmin" ? (
                  <Link to={AppRoutes.ADD_USER} className={"btn btn-success"}>
                    <i className='fa fa-plus' /> Add user
                  </Link>
                ) : null}
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>
                <Form.Group className='col-sm-12 mb-0'>
                  <div className='checkbox'>
                    {editAccess === "UserEdit" ||
                      editAccess === "SuperAdmin" ? (
                      <div className="d-flex justify-content-center align-items-center">
                        <label
                          htmlFor={"userall"}
                          className='d-flex  align-items-center'
                        >
                          <input
                            type='checkbox'
                            name={"selectUser"}
                            id={"userall"}
                            checked={
                              userData && selectedUser.length ? (userData && selectedUser.length === userData.length) : false
                            }
                            onChange={this.handleAllCheck}
                            className='checkbox-defaults'
                          />
                          <span className='checkbox-material'>
                            <span className='check' />
                          </span>
                          {
                            this.state.minusSign ? <span className="minusSign">-</span> : null
                          }
                        </label>
                        <div className="mb-2">
                          <Dropdown className='mt-3'>
                            <Dropdown.Toggle
                              variant='success'
                              id='dropdown-basic'
                              className='dropdown_toogle background_remove'
                            ></Dropdown.Toggle>
                            <Dropdown.Menu className='dropdown_toggle_menu'>
                              {/* <Dropdown.Item href="#">All</Dropdown.Item> */}
                              <Dropdown.Item
                                href='#'
                                onClick={() => this.bulkAction("Active")}
                                disabled={this.state.checkboxStatus}
                              >
                                Activate
                              </Dropdown.Item>
                              <Dropdown.Item
                                href='#'
                                onClick={() => this.bulkAction("Deactive")}
                                disabled={this.state.checkboxStatus}
                              >
                                Deactivate
                              </Dropdown.Item>
                              <Dropdown.Item
                                href='#'
                                onClick={() => this.bulkAction("Delete")}
                                disabled={this.state.checkboxStatus}
                              >
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    ) : "#"}
                  </div>
                </Form.Group>
              </th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email Address</th>
              <th>User Type</th>
              <th>Status</th>
              {editAccess === "UserEdit" ||
                editAccess === "SuperAdmin" ? (
                <th>Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {userData.length ? (
              userData.map((user: IUserData, index: number) => {
                return (
                  <tr key={user._id}>
                    <td>
                      <Form.Group className='col-sm-12 mb-0'>
                        <div className='checkbox'>
                          {editAccess === "UserEdit" ||
                            editAccess === "SuperAdmin" ? (
                            <label className='d-flex justify-content-center align-items-center'>
                              <input
                                type='checkbox'
                                name={"user"}
                                checked={
                                  selectedUser.indexOf(user._id) > -1
                                    ? true
                                    : false
                                }
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  this.handleSingleCheck(
                                    e,
                                    user._id ? user._id : ""
                                  )
                                }
                                id={`user${index}`}
                                className='checkbox-defaults'
                              />
                              <span className='checkbox-material'>
                                <span className='check' />
                              </span>
                              {count + index}.
                            </label>
                          ) : (
                            `${count + index}.`
                          )}
                        </div>
                      </Form.Group>
                    </td>
                    <td className={"text-capitalize"}>{user.firstName}</td>
                    <td className={"text-capitalize"}>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Button
                        type='button'
                        color={user.isActive ? "primary" : "danger"}
                        className=
                        {`
                    ${user.isActive
                            ? "btn btn-sm btn-primary"
                            : "btn btn-sm btn-danger"
                          }
                      ${editAccess === "UserEdit" ||
                            editAccess === "SuperAdmin"
                            ? null
                            : "btn-disabled"
                          }`}
                        onClick={() =>
                          this.handleStatus(
                            user && user._id ? user._id : "",
                            !user.isActive
                          )
                        }
                        disabled={
                          editAccess === "UserEdit" ||
                            editAccess === "SuperAdmin"
                            ? false
                            : true
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Button>
                    </td>
                    {editAccess === "UserEdit" ||
                      editAccess === "SuperAdmin" ? (
                      <td className='overflow-hidden'>
                        <div className='action-buttons d-flex align-items-center'>
                          <button
                            data-toggle='tooltip'
                            data-placement='bottom'
                            title='Edit'
                            type='button'
                            className='btn edit-icon '
                            onClick={() => {
                              if (user && user._id) {
                                this.props.history.push(
                                  AppRoutes.EDIT_USER.replace(":id", user._id)
                                );
                              }
                            }}
                          >
                            <Edit />
                          </button>
                          <button
                            data-toggle='tooltip'
                            data-placement='bottom'
                            title='Delete'
                            type='button'
                            className='btn'
                            onClick={() =>
                              this.handleDelete(
                                user && user._id ? user._id : "",
                                !user.isActive
                              )
                            }
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className='text-center'>
                  No User found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {totalRecords > paginationLimit ? (
          <PaginationComponent
            totalRecords={totalRecords ? totalRecords : 0}
            pageLimit={paginationLimit}
            currentPage={currentPage}
            onPageChanged={this.onPageChanged}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps: any = (state: IRootState) => ({
  userReducer: state.userReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getUsers: (data: any) => {
      dispatch(getUserRequest(data));
    },
    updateUserStatus: (data: any) => {
      dispatch(userStatusRequest(data));
    },
    getUserReport: (data: any) => {
      dispatch(getUserReportRequest(data));
    },
    deleteUser: (data: any) => {
      dispatch(userDeleteRequest(data));
    },
    bulkAction: (data: any) => {
      dispatch(bulkUserActionRequest(data));
    },
    redirectTo: (data: any) => {
      dispatch(redirectTo(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
