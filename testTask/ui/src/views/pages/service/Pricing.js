import { Link } from "react-router-dom";
import { AppRoutes } from "../../../routes/AppRoutes";

const Pricing = ({
  tierName,
  description,
  price,
  _id,
  service_id,
  serviceName,
}) => {
  return (
    <div class='card-deck mb-3 text-center'>
      <div class='card mb-4 shadow-sm'>
        <div class='card-header'>
          <h4 class='my-0 font-weight-normal'>{tierName}</h4>
        </div>
        <div class='card-body'>
          <h1 class='card-title pricing-card-title'>
            ${price} <small class='text-muted'>/ mo</small>
          </h1>
          <div dangerouslySetInnerHTML={{ __html: description }} />
          <Link
            to={`${AppRoutes.CHECKOUT}/${service_id}/${_id}/${window.btoa(
              serviceName
            )}`}
            class='btn btn-lg btn-block btn-outline-primary'
          >
            Buy now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
