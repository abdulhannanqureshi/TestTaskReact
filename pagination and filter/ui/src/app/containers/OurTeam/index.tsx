import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// For Redux Action
import {
  getOurTeamRequest,
  deleteOurTeamRequest,
  statusOurTeamRequest,
  bulkOurTeamRequest,
  orderOurTeamRequest
} from "../../../actions";
// For Interface
import { IOurTeamModel } from "../../../interfaces";
import { ConfirmBox } from "../../../helper";
import { AppRoutes } from "../../../config";
import PaginationComponent from "../../components/Pagination";
import { ImageBaseUrl } from "../../../helper/ComanFunctions";

import {
  Table,
  Button,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import { Trash2, Edit } from "react-feather";
import { toast } from "react-toastify";
import defaultImage from "../../../assets/avatars/user-default.svg";
import { valueTernary } from "react-select/dist/declarations/src/utils";

const OurTeam = (props: any) => {
  // For search & pagination object
  const defaultForm = {
    skip: 1,
    limit: 10,
    searchValue: "",
    isActive: "",
    fromDate: "",
    toDate: "",
  };
  // Set state for search and pagination
  const [form, setForm] = useState(defaultForm);
  // For get reducer data
  const { teamData, totalRecords } = useSelector(
    (state: any) => state.ourTeamReducer
  );
  const [orderState, setOrderState] = useState([]);
  useEffect(() => {
    console.log(teamData)
    if (teamData) {
      console.log(teamData, "hello");
      let teamDataArray: any = []
      for (let x in teamData) {
        teamDataArray.push({
          lable: teamData[x]._id,
          value: parseInt(teamData[x].order)
        })
      }
      teamDataArray.pop()
      setOrderState(teamDataArray)

    }
  }, [teamData])
  // For Call redux action
  const dispatch = useDispatch();
  const [minusSign, setminusSign] = useState(false);
  const [checkboxStatus, setcheckboxStatus] = useState(true)

  // For get User Data
  useEffect(() => {
    try {
      // For Decode Pagination
      if (props.location.search.substr(1)) {
        let queryDecode = JSON.parse(atob(props.location.search.substr(1)));
        setForm({ ...form, ...queryDecode });
        handleQueryParams(queryDecode);
      } else {
        handleQueryParams(form);
      }
    } catch (err) {
      handleQueryParams(form);
    }
  }, []);

  // For Get User Date With pagination & Search
  const handleQueryParams = (params: object) => {
    console.log(params,"params are this")
    dispatch(getOurTeamRequest(params));
  };

  // For Status Change
  const handleStatus = async (id: string, isActive: boolean) => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: isActive
        ? "Do you want to activate this team member?"
        : "Do you want to deactivate this team member?",
      confirmButtonText: isActive ? `Yes, deactivate!` : `Yes, activate!`,
    });
    if (!value) {
      return;
    } else {
      dispatch(
        statusOurTeamRequest({
          id,
          isActive: !isActive,
        })
      );
    }
  };

  const pageChanged = (page: number) => {
    setForm({ ...form, skip: page });
    handleQueryParams({ ...form, skip: page });
    // For Encoded
    let queryEncode: any = { ...form, skip: page };
    props.history.push(
      `${AppRoutes.OUR_TEAM}?${btoa(JSON.stringify(queryEncode))}`
    );
  };

  // For Search
  const handleChange = ({ target }: any) => {
    const { name, value } = target;
    setForm({ ...form, [name]: value });
    if (name === "isActive") {
      handleQueryParams({ ...form, isActive: value });
      props.history.push(
        `${AppRoutes.OUR_TEAM}?${btoa(
          JSON.stringify({ ...form, isActive: value })
        )}`
      );
    }
  };
  // For Search Record
  const searchRecord = () => {
    setForm({ ...form, skip: 1 });
    handleQueryParams({ ...form, skip: 1 });
    // For Encoded
    props.history.push(
      `${AppRoutes.OUR_TEAM}?${btoa(JSON.stringify({ ...form, skip: 1 }))}`
    );
  };

  // For Reset Search
  const handleReset = () => {
    const params = {
      ...form,
      searchValue: "",
      skip: 1,
      limit: 10,
      isActive: "",
    };
    setForm(params);
    handleQueryParams(params);
    props.history.push(AppRoutes.OUR_TEAM);
  };

  // For Delete Corporate
  const handleDelete = async (id: any) => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: "Do you want to delete this team member",
      confirmButtonText: "Yes, delete!"
    });
    if (value) {
      dispatch(deleteOurTeamRequest(id));
    }
  };

  // For Bulk Action
  const [selectedUser, setSelectedUser] = useState([]);
  // For All Check
  const handleAllCheck = (event: any) => {
    const { target } = event;
    const { checked } = target;
    // const { userReducer } = this.props;
    const selectedUser: any = [];
    if (teamData.length && checked) {
      teamData.forEach((user: any) => {
        selectedUser.push(user._id);
      });
    }
    setSelectedUser(selectedUser);
    setminusSign(false);
    setcheckboxStatus(checked ? false : true)
  };

  // For Single Check
  const handleSingleCheck = (event: any, id: string) => {
    const { target } = event;
    const { checked } = target;
    let selectedList: any = [...selectedUser];
    if (checked) {
      selectedList = [...selectedList, id];
    } else {
      let index = selectedList.indexOf(id as never);
      if (index > -1) {
        selectedList = selectedList.filter((user: string) => user !== id);
      }
    }
    setSelectedUser(selectedList);
  };
  useEffect(() => {
    if (selectedUser.length) {
      setminusSign(true);
      setcheckboxStatus(false)
    }
    else {
      setminusSign(false);
      setcheckboxStatus(true)
    }

  }, [selectedUser])
  // For Bulk Action :- Active, Deactivate and Delete
  const bulkAction = async (action: any) => {
    let msg = "Do you want to delete this selected team member!";
    let confirmButtonText = "Yes, delete!"
    if (action === "Active") {
      msg =
        "Do you want to change status active of this selected  team member!";
      confirmButtonText = "Yes, activate!"
    }

    if (action === "Deactive") {
      msg =
        "Do you want to  change status deactive of this selected  team member!";
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
      dispatch(
        bulkOurTeamRequest({
          ids: selectedUser,
          type: action,
        })
      );
    }
  };
  // For Table Index
  let count = (form.skip - 1) * form.limit + 1;

  // For Check Sub Admin Edit
  const [editAccess, setEditAccess] = useState("");
  useEffect(() => {
    let getSubAdmin: any = localStorage.getItem("SubAdminCheck");
    let checkSubAdmin: any = JSON.parse(getSubAdmin);
    let getViewRoute: any;
    if (checkSubAdmin.length) {
      // "CmsEdit" this string is for edit access
      // Note This string change for according page
      getViewRoute = checkSubAdmin.find((e: any) => e === "CmsEdit");
    } else {
      getViewRoute = "SuperAdmin";
    }
    setEditAccess(getViewRoute);
  }, []);

  const handleOrder = (data: any, value: any) => {
    let tempArray: any = []
    let objectTemp = {
      lable: data,
      value: parseInt(value)
    }
    tempArray.push(objectTemp)
    let result: any = orderState.map((obj: any) => tempArray.find((o: any) => o.lable === obj.lable) || obj);
    setOrderState(result)
  }
  const handleOrderSubmit = () => {
    const isEmpty: any = orderState.filter((e: any) => {  return e.value == "" || e.value == null })
    const isNotNumber = orderState.filter((e:any)=>{return   isNaN(e.value)})
    if (isEmpty.length || isNotNumber.length) {
      
      toast.error("Please fill order number in all fields.");
    }
    else {
      dispatch(orderOurTeamRequest({ updateOrder: orderState }))
    }
  }

  const getValue = (lable: any) => {
    if (orderState.length) {

      const resulting: any = orderState.filter((e: any) => { return e.lable == lable })
      if (resulting.length) {
        const orderNumberIntance: any = resulting[0].value
        return orderNumberIntance
      }

    }
  }

  return (
    <div>
      <Card className={"mb-0"}>
        <Card.Body className={""}>
          <Row className={"page-header-panel"}>
            {/* <Col md='2' lg="3" xl="2">
              <h3 className={"page-header"}>Our Team</h3>
            </Col> */}
            <Col md='4' lg="8" xl="6" className='margin_sm_top'>
              <div className={"d-flex"}>
                <InputGroup>
                  <FormControl
                    placeholder='Search first name/ last name/ designation'
                    aria-label='Search user'
                    name='searchValue'
                    value={form.searchValue}
                    onChange={handleChange}
                    className='modified_placeholders'
                  />
                  <Button
                    variant='primary'
                    id='button-addon2'
                    className={"mr-2"}
                    onClick={searchRecord}
                  >
                    Search
                  </Button>
                  <Button
                    variant='outline-secondary'
                    id='button-addon2'
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </InputGroup>
              </div>
            </Col>
            <Col md='3' lg="3" xl="2" className='margin_sm_top'>
              <div className={"filter-block "}>
                <label className={"pt-2 mr-2"}>Status:</label>
                <Form.Control
                  as='select'
                  custom
                  onChange={handleChange}
                  name='isActive'
                  value={form.isActive}
                >
                  <option value=''>All</option>
                  <option value='true'>Active</option>
                  <option value='false'>Inactive</option>
                </Form.Control>
              </div>
            </Col>
            <Col md='6' lg="6" xl="4" className='margin_sm_top mt-2 mt-xl-0  modified_divs'>
                {editAccess === "CmsEdit" ||
                editAccess === "SuperAdmin" ? (
                <div className={"addOrder"}>
                  <button onClick={handleOrderSubmit} className={"btn btn-modifiedColor  modified-sm-class"}>
                    Update Order
                  </button>
                </div>) : null}
                {editAccess === "CmsEdit" ||
                editAccess === "SuperAdmin" ? (
                <div className={"filter-block"}>
                  <Link to={AppRoutes.ADD_TEAM} className={"btn btn-success"}>
                    <i className='fa fa-plus' /> Add Team Member
                  </Link>
                </div>) : null}
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
                  {editAccess === "CmsEdit" ||
                    editAccess === "SuperAdmin" ? (
                    <div className="d-flex justify-content-center align-items-center">
                      <label
                        htmlFor={"userall"}
                        className='d-flex justify-content-center align-items-center'
                      >
                        <input
                          type='checkbox'
                          name={"selectUser"}
                          id={"userall"}
                          checked={
                            teamData && selectedUser.length === teamData.length
                          }
                          onChange={handleAllCheck}
                          className='checkbox-defaults'
                        />
                        <span className='checkbox-material'>
                          <span className='check' />
                        </span>
                        {
                          minusSign ? <span className="minusSign">-</span> : null
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
                            <Dropdown.Item
                              href='#'
                              onClick={() => bulkAction("Active")}
                              disabled={checkboxStatus}
                            >
                              Activate
                            </Dropdown.Item>
                            <Dropdown.Item
                              href='#'
                              onClick={() => bulkAction("Deactive")}
                              disabled={checkboxStatus}
                            >
                              Deactivate
                            </Dropdown.Item>
                            {/* <Dropdown.Item
                              href='#'
                              onClick={() => bulkAction("Delete")}
                              disabled={checkboxStatus}
                            >
                              Delete
                            </Dropdown.Item> */}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  ) : (
                    "#"
                  )}
                </div>
              </Form.Group>
            </th>
            <th>First Name</th>
            <th>Last Name</th>
            {/* <th>Email Address</th> */}
            <th>Designation</th>
            <th>Order
              (Total = {teamData.length ? teamData.length : "0"})
            </th>
            {/* <th>About us</th> */}
            <th>Status</th>
            {editAccess === "CmsEdit" ||
              editAccess === "SuperAdmin" ? (
              <th>Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {teamData && teamData.length ?
            <>
              {teamData.map((teamList: IOurTeamModel, index: number) => {
                return (
                  <tr key={teamList._id}>
                    <td>
                      <Form.Group className='col-sm-12 mb-0'>
                        <div className='checkbox'>
                          {editAccess === "CmsEdit" ||
                            editAccess === "SuperAdmin" ? (
                            <label className='d-flex justify-content-center align-items-center'>
                              <input
                                type='checkbox'
                                name='user'
                                checked={
                                  selectedUser.indexOf(teamList._id as never) > -1
                                    ? true
                                    : false
                                }
                                onChange={(e) =>
                                  handleSingleCheck(
                                    e,
                                    teamList._id ? teamList._id : ""
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
                    <td className={"text-capitalize"}>
                      {teamList.teamMemberImage &&
                        teamList.teamMemberImage.length ? (
                        <img
                          src={ImageBaseUrl(teamList.teamMemberImage)}
                          alt='Profile'
                          className='teamProfile'
                        />
                      ) : (
                        <img
                          src={defaultImage}
                          alt='Profile'
                          className='teamProfile'
                        />
                      )}
                      {teamList.firstName}
                    </td>
                    <td className={"text-capitalize"}>{teamList.lastName}</td>

                    <td className={"text-capitalize"}>{teamList.designation}</td>
                    <td className={"text-capitalize order_td"}>
                      <input type="number"
                        min="1"
                        value={getValue(teamList._id)}
                        onChange={(e) => handleOrder(teamList._id, e.target.value)}
                        className="order-input"
                      />
                    </td>

                    <td>
                      <Button
                        type='button'
                        color={teamList.isActive ? "primary" : "danger"}
                        className=
                        {`
                      ${teamList.isActive
                            ? "btn btn-sm btn-primary"
                            : "btn btn-sm btn-danger"
                          }
                      ${editAccess === "CmsEdit" ||
                            editAccess === "SuperAdmin"
                            ? null
                            : "btn-disabled"
                          }`}
                        onClick={() =>
                          handleStatus(teamList._id, teamList.isActive)
                        }
                        disabled={
                          editAccess === "CmsEdit" ||
                            editAccess === "SuperAdmin"
                            ? false
                            : true
                        }
                      >
                        {teamList.isActive ? "Active" : "Inactive"}
                      </Button>
                    </td>

                    {editAccess === "CmsEdit" ||
                      editAccess === "SuperAdmin" ? (
                      <td className='overflow-hidden'>
                        <div className='action-buttons d-flex align-items-center'>
                          <Link
                            className='btn edit-icon'
                            to={`${AppRoutes.EDIT_TEAM}/${teamList._id}`}
                          >
                            <Edit />
                          </Link>
                          <button
                            data-toggle='tooltip'
                            data-placement='bottom'
                            title='Delete'
                            type='button'
                            className='btn'
                            onClick={() => handleDelete(teamList._id)}
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </td>) : null}
                  </tr>
                );
              })}
            </> :
            null
          }
          {!teamData.length ? (
            <tr>
              <td colSpan={10} className='text-center'>
                No User found
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>
    </div>
  );
};

export default OurTeam;
