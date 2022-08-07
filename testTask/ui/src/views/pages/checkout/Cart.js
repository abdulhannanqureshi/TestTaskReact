import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import { ApiHelper } from "../../../helper/ApiHelper/apiHelper";
import { ApiRoutes } from "../../../config";
import { Toaster } from "../../../helper/CommonServices";
import { useParams } from "react-router-dom";
const Cart = () => {
  const [tierDetail, setTierDetail] = useState({});
  const { tier_id, slug } = useParams();

  const getTier = async () => {
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.TIER_DETAILS.service,
      ApiRoutes.TIER_DETAILS.url.replace(":id", tier_id),
      ApiRoutes.TIER_DETAILS.method,
      ApiRoutes.TIER_DETAILS.authenticate
    );
    if (response && !response.isError) {
      setTierDetail(response.data.data);
    } else {
      Toaster({
        type: "error",
        text: response.messages[0],
      });
    }
  };
  useEffect(() => {
    getTier();
  }, []);

  return (
    <Col md='4' className='order-md-2 mb-4'>
      <h4 className='d-flex justify-content-between align-items-center mb-3'>
        <span className='text-muted'>Your cart</span>
      </h4>
      <ul className='list-group mb-3'>
        <li className='list-group-item d-flex justify-content-between lh-condensed'>
          <div>
            <h6 className='my-0'>{slug ? window.atob(slug) : ""}</h6>
            <small className='text-muted'>
              {tierDetail.tierName ? tierDetail.tierName : ""}
            </small>
          </div>
          <span className='text-muted'>
            ${tierDetail.price ? tierDetail.price : ""}
          </span>
        </li>
        <li className='list-group-item d-flex justify-content-between'>
          <span>Total (USD)</span>
          <strong>${tierDetail.price ? tierDetail.price : ""}</strong>
        </li>
      </ul>
    </Col>
  );
};

export default Cart;
