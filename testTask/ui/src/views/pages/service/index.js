import { useState, useEffect } from "react";

import { ApiHelper } from "../../../helper/ApiHelper/apiHelper";
import { ApiRoutes } from "../../../config";
import { Toaster } from "../../../helper/CommonServices";
import { ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import TierList from "./TierList";
import Spinner from "react-bootstrap/Spinner";

const Service = () => {
  const [serviceDetail, setServiceDetail] = useState({});
  const { slug } = useParams();

  const [loader, setLoader] = useState(false);
  const getServices = async () => {
    setLoader(true);
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.SERVICE_DETAILS.service,
      ApiRoutes.SERVICE_DETAILS.url.replace(":id", slug),
      ApiRoutes.SERVICE_DETAILS.method,
      ApiRoutes.SERVICE_DETAILS.authenticate
    );
    if (response && !response.isError) {
      setServiceDetail(response.data.data);
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
    <div className='main inner-wrapper'>
      {loader ? (
        <div className='loader-wrapper'>
          <Spinner animation='grow' />
        </div>
      ) : null}
      <div class='pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center'>
        <h1 class='display-4'>
          {serviceDetail.serviceName ? serviceDetail.serviceName : ""}
        </h1>
        <div
          class='lead'
          dangerouslySetInnerHTML={{
            __html: serviceDetail.description ? serviceDetail.description : "",
          }}
        />
      </div>
      <TierList
        service_id={serviceDetail._id}
        serviceName={serviceDetail.serviceName}
      />
      <ToastContainer />
    </div>
  );
};

export default Service;
