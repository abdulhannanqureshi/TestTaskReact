import { useState, useEffect } from "react";
import { ApiHelper } from "../../../helper/ApiHelper/apiHelper";
import { ApiRoutes } from "../../../config";
import { Toaster } from "../../../helper/CommonServices";
import { ToastContainer } from "react-toastify";
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Banner from '../../component/banner'
import noData from '../../../assets/img/icon_no_data.png'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Spinner from "react-bootstrap/Spinner";
import Table from 'react-bootstrap/Table'

// Step 1: Install package "npm i react-js-pagination"
import Pagination from "react-js-pagination";
import { useLocation } from "react-router-dom";

const Home = ({history}) => {
  // Get Query Params by refresh
  const { search } = useLocation();
  const skip = new URLSearchParams(search).get('skip')
  const searchValue = new URLSearchParams(search).get('searchValue')

  // Step 3: set by default value for skip and limit
  // activePage={form.skip} for active page
  // itemsCountPerPage={form.limit} for per page limit
  const defaultForm = {
    skip: 1,
    limit: 10,
    searchValue: "",
  };
  const [form, setForm] = useState(defaultForm);

  const [loader, setLoader] = useState(false);
  const [data, setDate] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const getCorporate = async (params) => {
    setLoader(true);
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.CORPORATE.service,
      ApiRoutes.CORPORATE.url,
      ApiRoutes.CORPORATE.method,
      ApiRoutes.CORPORATE.authenticate,
      params
    );
    if (response && !response.isError) {
      setDate(response.data.data)
      setTotalRecords(response.data.totalRecords)
    } else {
      Toaster({
        type: "error",
        text: response.messages[0],
      });
    }
    setLoader(false);
  };

  // Step 5: Define onChange function for pagination
  const pageChanged = (page) => {
    setForm({ ...form, skip: page });
    const params = {
      skip: page,
      searchValue: form.searchValue,
    }
    if(form.searchValue && form.searchValue.length){
      history.push({
        pathname: window.location.pathname,
        search: new URLSearchParams(params).toString()
      })
    }
    else{
      history.push({
        pathname: window.location.pathname,
        search: `skip=${page}`
      })
    }
    getCorporate({ ...form, skip: page });
  };

  // Handle change For search
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm({ ...form, [name]: value });
  };

  // Search data with refresh
  const searchRecord = () => {
    if(form.searchValue){
      const formData = {...form, skip: 1}
      setForm(formData);

      getCorporate(formData);

      const params = {
        skip: formData.skip,
        searchValue: form.searchValue,
      }
      history.push({
        pathname: window.location.pathname,
        search: new URLSearchParams(params).toString()
      })
    }else{
      Toaster({
        type: "error",
        text: "Please enter at least one word",
      });
    }
  };

   // Step 6: Get Data with pagination & search
   useEffect(() => {
    if (searchValue && searchValue.length) {
      setForm({ ...form, skip, searchValue });
      getCorporate({ ...form, skip, searchValue });
    }
    else if (skip && skip.length) {
      setForm({ ...form, skip });
      getCorporate({ ...form, skip });
    } else {
      getCorporate(form);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzFlZTRmMWQ2YThiNzA5NTdiODkyYSIsInJhbmRvbUtleSI6IiQyYiQwOCRqNVpmTzg5Y1FDLlBOYzNRUnFITkRPIiwiZW1haWwiOiJzdXBlcmFkbWluQGNvaW5pZmlkZS5jb20iLCJmaXJzdE5hbWUiOiJTdXBlckFkbWluIiwibGFzdE5hbWUiOiIiLCJpYXQiOjE2NTExMjY0NDUsImV4cCI6MTY1MTIxMjg0NX0.xL99fdnd_DyFY-jLQtvWpt33ptb57JyCKsKU775u0v0")
  }, []);

  let count = (form.skip - 1) * form.limit + 1;
  return (
    <div className='main'>
      <ToastContainer />
      <div>
      <Banner title="Corporate" description=" Lorem ipsum is placeholder text commonly used in the graphic."/>
      {loader ? (
        <div className='loader-wrapper'>
          <Spinner animation='grow' />
        </div>
      ) : null}
      <Container>
        <div className="mb-5">
          <div >
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search..."
              name='searchValue'
              value={form.searchValue}
              aria-label="Search"
              aria-describedby="basic-addon2"
              onChange={handleChange}
            />
            <Button variant="outline-secondary" className="search-btn" id="button-addon2" onClick={searchRecord}>
              Search
            </Button>
          </InputGroup>
          </div>
          <h2 className="text-center mb-5">Corporate List</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Corporate Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {data && data.length ?
              data.map((item,index) => (
                <tr key={item._id}>
                  <td>{index + count}</td>
                  <td>{item.name}</td>
                  <td>{item.isActive ? <Button variant="primary">Active</Button> : <Button variant="secondary" disabled>Inactive</Button>}</td>
                  <td>Delete</td>
                </tr>)
              ) :
              <tr md={12}>
                <td colSpan={4} className="text-center no-data">
                  <Card.Img variant="top" className="img-no-data" src={noData} />
                  <Card.Title>No Data Found</Card.Title>
                </td>
              </tr>
            }
            </tbody>
          </Table>
        {/* Step 2: Put pagination component with props "<Pagination />"
          Props Explain:-
          activePage -> Put number for active pagination (Required. Active page)
          itemsCountPerPage -> Pagination limit for each page (By Default 10)
          totalItemsCount -> Put total record number
          onChange -> Required. Page change handler. Receive pageNumber as arg
          ====>
          Two props for design
          itemClass="page-item"
          linkClass="page-link" */}

          {totalRecords > form.limit ? (
            <div className="pagination-wrap">
              <Pagination
                activePage={+form.skip}
                itemsCountPerPage={form.limit}
                totalItemsCount={totalRecords}
                onChange={pageChanged}
                itemClass="page-item"
                linkClass="page-link"
              />
          </div>
          ) : null}
        </div>
      </Container>
      </div>
    </div>
  );
};

export default Home;