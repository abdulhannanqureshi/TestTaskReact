import React, { useEffect, useState } from "react";
import { Link, useLocation  } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getCorporateRequest,
  statusCorporateRequest,
  deleteCorporateRequest,
} from "../../../actions";
import { ConfirmBox } from "../../../helper";
import { AppRoutes } from "../../../config";
import {
  Table,
  Button,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  FormControl,
  Tab,
  Tabs,
} from "react-bootstrap";
import { Trash2, Edit } from "react-feather";




// Step 1: Install package "npm i react-js-pagination"
import Pagination from "react-js-pagination";

const UserCorporate = (props) => {
  // get query params by hooks
  const { search } = useLocation();
  const skip = new URLSearchParams(search).get('skip')
  const searchValue = new URLSearchParams(search).get('searchValue')
  const tabEventKey = new URLSearchParams(search).get('tabKey')


  // Step 3: set by default value for skip and limit
  // activePage={form.skip} for active page
  // itemsCountPerPage={form.limit} for per page limit
  const defaultForm = {
    skip: 1,
    limit: 10,
    searchValue: "",
    isActive: "",
    fromDate: "",
    toDate: "",
  };
  const [form, setForm] = useState(defaultForm);


  // Step 4: Get totalRecords by api
  const { corporateData, totalRecords } = useSelector(
    (state) => state.corporateReducer
  );
  const dispatch = useDispatch();

  // Step 6: Get Data with pagination & search
  useEffect(() => {
    if (searchValue && searchValue.length) {
      setForm({ ...form, skip, searchValue });
      handleQueryParams({ ...form, skip, searchValue });
    }
    else if (skip && skip.length) {
      setForm({ ...form, skip });
      handleQueryParams({ ...form, skip });
    } else {
      handleQueryParams(form);
    }
  }, []);


  // For Get Corporate Date With pagination & Search
  const handleQueryParams = (params) => {
    dispatch(getCorporateRequest(params));
  };

  // Step 5: Define onChange function for pagination
  const pageChanged = (page) => {

    setForm({ ...form, skip: page });
    const params = {
      skip: page,
      searchValue: form.searchValue,
    }
    if(searchValue && searchValue.length){
      props.history.push({
        pathname: window.location.pathname,
        search: new URLSearchParams(params).toString()
      })
    }
    else{
      props.history.push({
        pathname: window.location.pathname,
        search: `skip=${page}`
      })
    }
    handleQueryParams({ ...form, skip: page });
  };

  // Search Data with refresh
  const searchRecord = () => {
    const formData = {...form, skip: 1}
    setForm(formData);
    handleQueryParams(formData);
    const params = {
      skip: formData.skip,
      searchValue: form.searchValue,
    }
    props.history.push({
      pathname: window.location.pathname,
      search: new URLSearchParams(params).toString()
    })
  };

  // Handle change For search
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm({ ...form, [name]: value });

    // Fir status
    // if (name === "isActive") {
    //   handleQueryParams({ ...form, isActive: value });
    //   props.history.push(
    //     `${AppRoutes.CORPORATE}?${btoa(
    //       JSON.stringify({ ...form, isActive: value })
    //     )}`
    //   );
    // }
  };

  // For tabs handle
  const [tabKey, setTabKey] = useState('home')
  const handleTabs = (key) => {
    setTabKey(key)
    const params = {
      skip,
      searchValue,
      tabKey: key
    }
    props.history.push({
      pathname: window.location.pathname,
      search: new URLSearchParams(params).toString()
    })
  }

  useEffect(() => {
    if (tabEventKey && tabEventKey.length) {
      setTabKey(tabEventKey)
    }
  }, []);






    // For Status Change
    const handleStatus = async (id, isActive) => {
      const { value } = await ConfirmBox({
        title: "Are you sure?",
        text: isActive
          ? "Do you want to deactivate this Corporate?"
          : "Do you want to activate this Corporate?",
        confirmButtonText: isActive ? `Yes, deactivate!` : `Yes, activate!`,
      });

      if (!value) {
        return;
      } else {
        dispatch(
          statusCorporateRequest({
            id,
            isActive: !isActive,
          })
        );
      }
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
    props.history.push(AppRoutes.CORPORATE);
  };

  // For Delete Corporate
  const handleDelete = async (id) => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: "Do you want to delete this Corporate",
      confirmButtonText: "Yes Delete",
    });
    if (value) {
      dispatch(deleteCorporateRequest(id));
    }
  };
  // For Table Index
  let count = (form.skip - 1) * form.limit + 1;
  // For Check Sub Admin Edit
  const [editAccess, setEditAccess] = useState("");
  useEffect(() => {
    let getSubAdmin = localStorage.getItem("SubAdminCheck");
    let checkSubAdmin = JSON.parse(getSubAdmin);
    let getViewRoute;
    if (checkSubAdmin.length) {
      // "CorporateEdit" this string is for edit access
      // Note This string change for according page
      getViewRoute = checkSubAdmin.find((e) => e === "CorporateEdit");
    } else {
      getViewRoute = "SuperAdmin";
    }
    setEditAccess(getViewRoute);
  }, []);


  return (
    <div>
      <Card className={"mb-0"}>
        <Card.Body className={""}>
          <Row className={"page-header-panel"}>
            {/* <Col xl='2' md='2' sm='2'>
              <h3 className={"page-header"}>Corporation</h3>
            </Col> */}
            <Col xl='6' sm='10' className='margin_sm_top'>
              <div className={"d-flex"}>
                <InputGroup>
                  <FormControl
                    placeholder='Search corporation name'
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
            <Col xl='3' lg='6' md='10' sm='5' className='margin_sm_top'>
              <div className={"filter-block"}>
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
          </Row>
        </Card.Body>
      </Card>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <Form.Group className='col-sm-12 mb-0'>
                <div className='checkbox'>#</div>
              </Form.Group>
            </th>
            <th>Corporation Name</th>
            <th>Status</th>
            {editAccess === "CorporateEdit" || editAccess === "SuperAdmin" ? (
              <th>Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {corporateData.map(
            (corporateList, index) => {
              return (
                <tr key={corporateList._id}>
                  <td>
                    <Form.Group className='col-sm-12 mb-0'>
                      <div className='checkbox'>{index + count}</div>
                    </Form.Group>
                  </td>
                  <td className={"text-capitalize"}>{corporateList.name}</td>
                  <td>
                    <Button
                      type='button'
                      color={corporateList.isActive ? "primary" : "danger"}
                      className={`
                    ${
                      corporateList.isActive
                        ? "btn btn-sm btn-primary"
                        : "btn btn-sm btn-danger"
                    }
                      ${
                        editAccess === "CorporateEdit" ||
                        editAccess === "SuperAdmin"
                          ? null
                          : "btn-disabled"
                      }`}
                      onClick={() =>
                        handleStatus(corporateList._id, corporateList.isActive)
                      }
                      disabled={
                        editAccess === "CorporateEdit" ||
                        editAccess === "SuperAdmin"
                          ? false
                          : true
                      }
                    >
                      {corporateList.isActive ? "Active" : "Inactive"}
                    </Button>
                  </td>
                  {editAccess === "CorporateEdit" ||
                  editAccess === "SuperAdmin" ? (
                    <td className='overflow-hidden'>
                      <div className='action-buttons d-flex align-items-center'>
                        <Link
                          className='btn edit-icon'
                          to={`${AppRoutes.EDIT_CORPORATE}/${corporateList._id}`}
                        >
                          <Edit />
                        </Link>
                        <button
                          data-toggle='tooltip'
                          data-placement='bottom'
                          title='Delete'
                          type='button'
                          className='btn'
                          onClick={() => handleDelete(corporateList._id)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              );
            }
          )}

          {!corporateData.length ? (
            <tr>
              <td colSpan={10} className='text-center'>
                No User found
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>
      {/*
        Step 2: Put pagination component with props "<Pagination />"
          Props Explain:-
          activePage -> Put number for active pagination (Required. Active page)
          itemsCountPerPage -> Pagination limit for each page (By Default 10)
          totalItemsCount -> Put total record number
          onChange -> Required. Page change handler. Receive pageNumber as arg
          ====>
          Two props for design
          itemClass="page-item"
          linkClass="page-link"
      */}
      {totalRecords > form.limit ? (
        <Pagination
          activePage={+form.skip}
          itemsCountPerPage={form.limit}
          totalItemsCount={totalRecords}
          onChange={pageChanged}
          itemClass="page-item"
          linkClass="page-link"
        />
      ) : null}

      <hr/>
      <div>
        <h2>Tabs Demo</h2>
        <Tabs
          id="controlled-tab-example"
          activeKey={tabKey}
          onSelect={handleTabs}
          className="mb-3"
        >
          <Tab eventKey="home" title="Home">
            Home lorem Ipsume has been Profile
          </Tab>
          <Tab eventKey="profile" title="Profile">
            Profile lorem ipsume has been Profile
          </Tab>
          <Tab eventKey="contact" title="Contact">
            Contact lorem ipsume has been Contact
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default UserCorporate;
