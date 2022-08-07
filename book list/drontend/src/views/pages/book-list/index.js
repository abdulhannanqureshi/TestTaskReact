import { useState, useEffect } from "react";
import { ApiHelper } from "../../../helper/ApiHelper/apiHelper";
import { ApiRoutes } from "../../../config";
import { AppRoutes } from "../../../routes/AppRoutes";
import { Toaster } from "../../../helper/CommonServices";
import { ToastContainer } from "react-toastify";
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Banner from '../../component/banner'
import noPreview from '../../../assets/img/img_no_preview.png'
import noData from '../../../assets/img/icon_no_data.png'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import {TextTruncate} from '../../../helper/CommonServices'

const BookList = () => {
  const navigate = useNavigate();
  const [bookList, setBookList] = useState({});
  const [loader, setLoader] = useState(false);

  const [data, setData] = useState({search: 'a'});
  const getBookList = async (body) => {
    setLoader(true);
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.BOOK_LIST.service,
      ApiRoutes.BOOK_LIST.url,
      ApiRoutes.BOOK_LIST.method,
      ApiRoutes.BOOK_LIST.authenticate,
      body
    );
    if (response && !response.isError) {
      setBookList(response.data.data);
    } else {
      Toaster({
        type: "error",
        text: response.messages[0],
      });
    }
    setLoader(false);
  };
  useEffect(() => {
    getBookList(data);
    const token = localStorage.getItem("token");
    if(!token){
      Toaster({
        type: "error",
        text: "Your not login",
      });
      navigate(AppRoutes.HOME);
    }
  }, []);

  const handleChange = (e) => {
    const {value, name} = e.target;
    setData({...data, [name]:value})
    if(value.length > 2) getBookList({...data, search:value});
  }
  const handleSearch = () => {
    if(data.search.length > 2) getBookList({...data});
    else {
      Toaster({
        type: "error",
        text: "Please enter at least 3 words",
      });
    }
  }
  return (
    <div className='main'>
      <ToastContainer />
      <div>
      <Banner title="Book List" description=" Lorem ipsum is placeholder text commonly used in the graphic."/>
      {loader ? (
        <div className='loader-wrapper'>
          <Spinner animation='grow' />
        </div>
      ) : null}
      <Container>
        <Row className="mb-5">
          <Col md={12}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search..."
              aria-label="Search"
              aria-describedby="basic-addon2"
              onChange={handleChange}
              name="search"
            />
            <Button variant="outline-secondary" className="search-btn" id="button-addon2" onClick={handleSearch}>
              Search
            </Button>
          </InputGroup>
          </Col>
          {bookList && bookList.length ?
            bookList.map(item =>
           (   <Col md={3} key={item.id} className="card-book">
                <Card>
                  <Card.Img variant="top" className="img-book" src={item.thumbnail ? item.thumbnail : noPreview} />
                  <Card.Body>
                    {item.title ? (<Card.Title>{item.title}</Card.Title>): null}
                    {item.categories ? (<p className="mb-1">Categories : <b>{item.categories}</b></p>) : null}
                    <Card.Text>
                    {item.description ? TextTruncate({str:item.description, limit: 100}) : null}
                    </Card.Text>
                    {item.link ? (<a href={item.link} target="_blank" className="btn btn-primary">
                      Read More
                    </a>) :null}
                  </Card.Body>
                </Card>
              </Col>)
            ):
          <Col md={12}>
            <Card.Body className="text-center no-data">
              <Card.Img variant="top" className="img-no-data" src={noData} />
              <Card.Title>No Data Found</Card.Title>
            </Card.Body>
          </Col>
           }
        </Row>
      </Container>
      </div>
    </div>
  );
};

export default BookList;