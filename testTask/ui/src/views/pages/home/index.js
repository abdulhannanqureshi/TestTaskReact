import { useEffect, useState } from "react";
import Banner from "../../component/banner";
import Services from "./services";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ApiHelper } from "../../../helper/ApiHelper/apiHelper";
import { ApiRoutes } from "../../../config";
import { Toaster } from "../../../helper/CommonServices";
import { ToastContainer } from "react-toastify";
import { AppRoutes } from "../../../routes/AppRoutes";
import Spinner from "react-bootstrap/Spinner";

const Home = () => {
  const [serviceList, setServiceList] = useState([]);

  const [loader, setLoader] = useState(false);
  const getServices = async () => {
    setLoader(true);
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.SERVICE.service,
      ApiRoutes.SERVICE.url,
      ApiRoutes.SERVICE.method,
      ApiRoutes.SERVICE.authenticate
    );
    if (response && !response.isError) {
      setServiceList(response.data.data);
    } else {
      Toaster({
        type: "error",
        text: response.messages[0],
      });
    }
    setLoader(false);
  };
  useEffect(() => {
    getServices();
  }, []);

  return (
    <div className='main'>
      <ToastContainer />
      <Banner
        title='Hello, world!'
        description='This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.'
        btnTitle='Learn More'
        link='#'
      />
      <Container>
        <Row>
          {loader ? (
            <div className='loader-small'>
              <Spinner animation='grow' />
            </div>
          ) : null}
          {serviceList.map((item, index) => (
            <Col md='4' key={index}>
              <Services
                title={item.serviceName}
                description={item.description}
                btnTitle='Learn More'
                link={`${AppRoutes.SERVICES}/${item.slug}`}
              />
            </Col>
          ))}
        </Row>
        <hr />
      </Container>
    </div>
  );
};

export default Home;
