import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pricing from "./Pricing";
import { ApiHelper } from "../../../helper/ApiHelper/apiHelper";
import { ApiRoutes } from "../../../config";
import { Toaster } from "../../../helper/CommonServices";

const TierList = ({ service_id, serviceName }) => {
  const [tierList, setTierList] = useState([]);

  const getTiers = async () => {
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.TIER_LIST.service,
      ApiRoutes.TIER_LIST.url,
      ApiRoutes.TIER_LIST.method,
      ApiRoutes.TIER_LIST.authenticate
    );
    if (response && !response.isError) {
      setTierList(response.data.data);
    } else {
      Toaster({
        type: "error",
        text: response.messages[0],
      });
    }
  };
  useEffect(() => {
    getTiers();
  }, []);

  return (
    <Container>
      <Row>
        {tierList.map((item, index) => (
          <Col md='4' key={index}>
            <Pricing
              {...item}
              service_id={service_id}
              serviceName={serviceName}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
export default TierList;
