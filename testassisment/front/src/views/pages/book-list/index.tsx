import React, { useState, useEffect, useRef } from "react";
import { ApiHelper } from "../../../helper/ApiHelper/apiHelper";
import { ApiRoutes } from "../../../config";
import { AppRoutes } from "../../../routes/AppRoutes";
import { Toaster } from "../../../helper/CommonServices";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Banner from "../../component/banner";
import noPreview from "../../../assets/img/img_no_preview.png";
import noData from "../../../assets/img/icon_no_data.png";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { TextTruncate } from "../../../helper/CommonServices";
import { IBookListModel } from "../../../interfaces";
import BookDetails from "./bookDetails";

const BookList = () => {
  const searchFiled: any = useRef();

  const navigate = useNavigate();
  const [bookList, setBookList] = useState([]);
  const [loader, setLoader] = useState(false);

  const [data, setData] = useState({ search: "a" });
  const getBookList = async (body: object) => {
    setLoader(true);
    const response: any = await new ApiHelper().FetchFromServer(
      ApiRoutes.BOOK_LIST.service,
      ApiRoutes.BOOK_LIST.url,
      ApiRoutes.BOOK_LIST.method,
      ApiRoutes.BOOK_LIST.authenticate,
      body,
      undefined,
      undefined
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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(AppRoutes.HOME);
    }else{
      getBookList(data);
    }
  }, []);

  const handleChange = (e: any) => {
    const { value, name } = e.target;
    setData({ ...data, [name]: value });
    if (value.length > 2) getBookList({ ...data, search: value });
  };

  const handleSearch = () => {
    if (data.search.length > 2) getBookList({ ...data });
    else {
      Toaster({
        type: "error",
        text: "Please enter at least 3 words",
      });
    }
  };
  const handleReset = () => {
    setData({ ...data, search: "a" });
    getBookList({ ...data, search: "a" });
    searchFiled.current.value = "";
  };

  const [bookDetails, setBookDetails] = useState<any>({});
  const [modal, setModal] = useState(false);
  const bookDetailsHandle = (id: string) => {
    const getBooKDetail: any = bookList.find(
      (e: IBookListModel) => e.id === id
    );
    setBookDetails(getBooKDetail);
    setModal(true);
  };
  return (
    <div className='main'>
      <div>
        <Banner
          title='Book List'
          description=' Lorem ipsum is placeholder text commonly used in the graphic.'
        />
        {loader ? (
          <div className='loader-wrapper'>
            <Spinner animation='grow' />
          </div>
        ) : null}
        <Container>
          <Row className='mb-5'>
            <Col md={12}>
              <InputGroup className='mb-3'>
                <FormControl
                  placeholder='Search...'
                  aria-label='Search'
                  aria-describedby='basic-addon2'
                  onChange={handleChange}
                  className='custom-filed'
                  name='search'
                  ref={searchFiled}
                />
                {+data.search.length > 1 ? (
                  <Button
                    variant='light'
                    className='reset-filter'
                    onClick={handleReset}
                  >
                    x
                  </Button>
                ) : null}

                <Button
                  variant='outline-secondary'
                  className='search-btn'
                  id='button-addon2'
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </InputGroup>
            </Col>
            {bookList && bookList.length ? (
              bookList.map((item: IBookListModel) => (
                <Col md={3} key={item.id} className='card-book'>
                  <Card>
                    <Card.Img
                      variant='top'
                      className='img-book'
                      src={item.thumbnail ? item.thumbnail : noPreview}
                    />
                    <Card.Body>
                      {item.title ? (
                        <Card.Title>{item.title}</Card.Title>
                      ) : null}
                      {item.categories ? (
                        <p className='mb-1'>
                          <b>Categories</b> : {item.categories}
                        </p>
                      ) : null}
                      <Card.Text>
                        {item.description
                          ? TextTruncate(item.description, 100)
                          : null}
                      </Card.Text>
                      <Button onClick={() => bookDetailsHandle(item.id)}>
                        Read More
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col md={12}>
                <Card.Body className='text-center no-data'>
                  <Card.Img
                    variant='top'
                    className='img-no-data'
                    src={noData}
                  />
                  <Card.Title>No Data Found</Card.Title>
                </Card.Body>
              </Col>
            )}
          </Row>
        </Container>
      </div>
      <BookDetails
        modal={modal}
        setModal={setModal}
        bookDetails={bookDetails}
      />
    </div>
  );
};

export default BookList;
