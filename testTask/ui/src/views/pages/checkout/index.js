import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { checkoutSchema } from "../../../validators";
import { getValidationErrors } from "../../../helper/CommonServices";
import { ApiHelper } from "../../../helper/ApiHelper/apiHelper";
import { ApiRoutes } from "../../../config";
import { useParams } from "react-router-dom";
import { Toaster } from "../../../helper/CommonServices";
import { ToastContainer } from "react-toastify";
import Cart from "./Cart";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

const Checkout = () => {
  const navigate = useNavigate();
  const { service_id, tier_id } = useParams();
  const defaultForm = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    country: "",
    state: "",
    zip: "",
  };
  const errorObj = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    country: "",
    state: "",
    zip: "",
    cardName: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
  };
  const [form, setForm] = useState(defaultForm);
  const [errMessage, setErrMessage] = useState(errorObj);
  const handleChange = ({ target }) => {
    setForm({ ...form, [target.name]: target.value });
    setErrMessage({ ...errMessage, [target.name]: null });
  };

  const [loader, setLoader] = useState(false);
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      let data = { ...form, service: service_id, tier: tier_id };
      checkoutSchema.validateSync(form, {
        abortEarly: false,
      });
      setLoader(true);
      setErrMessage("");
      const response = await new ApiHelper().FetchFromServer(
        ApiRoutes.CHECKOUT.service,
        ApiRoutes.CHECKOUT.url,
        ApiRoutes.CHECKOUT.method,
        ApiRoutes.CHECKOUT.authenticate,
        undefined,
        data
      );
      if (response && !response.isError) {
        Toaster({
          type: "success",
          text: "Order has been placed successfully",
        });
        setLoader(false);
        navigate("/");
      } else {
        Toaster({
          type: "error",
          text: response.messages[0],
        });
      }
    } catch (error) {
      setErrMessage(getValidationErrors(error));
    }
  };
  return (
    <div className='main inner-wrapper'>
      <Container>
        <div className='py-5 text-center'>
          <h2>Checkout form</h2>
          <p className='lead'>
            Below is an example form built entirely with Bootstrap’s form
            controls. Each required form group has a validation state that can
            be triggered by attempting to submit the form without completing it.
          </p>
        </div>
        <Row>
          <Cart />
          <Col md='8' className='order-md-1'>
            <h4 className='mb-3'>Billing address</h4>
            {loader ? (
              <div className='loader-wrapper'>
                <Spinner animation='grow' />
              </div>
            ) : null}
            <form className='needs-validation' onSubmit={submitForm}>
              <div className='row'>
                <div className='col-md-6 mb-3'>
                  <label>First name</label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='First Name'
                    name='firstName'
                    value={form.firstName}
                    onChange={handleChange}
                  />
                  {errMessage && errMessage.firstName ? (
                    <span className='error-message'>
                      {errMessage.firstName}
                    </span>
                  ) : null}
                </div>
                <div className='col-md-6 mb-3'>
                  <label>Last name</label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Last Name'
                    name='lastName'
                    value={form.lastName}
                    onChange={handleChange}
                  />
                  {errMessage && errMessage.lastName ? (
                    <span className='error-message'>{errMessage.lastName}</span>
                  ) : null}
                </div>
              </div>
              <div className='mb-3'>
                <label>Email</label>
                <input
                  type='email'
                  className='form-control'
                  placeholder='Enter Email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                />
                {errMessage && errMessage.email ? (
                  <span className='error-message'>{errMessage.email}</span>
                ) : null}
              </div>
              <div className='mb-3'>
                <label>Address</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter Address'
                  name='address'
                  value={form.address}
                  onChange={handleChange}
                />
                {errMessage && errMessage.address ? (
                  <span className='error-message'>{errMessage.address}</span>
                ) : null}
              </div>
              <div className='row'>
                <div className='col-md-5 mb-3'>
                  <label>Country</label>
                  <select
                    className='custom-select d-block w-100'
                    name='country'
                    value={form.country}
                    onChange={handleChange}
                  >
                    <option value=''>Choose...</option>
                    <option>United States</option>
                  </select>
                  {errMessage && errMessage.country ? (
                    <span className='error-message'>{errMessage.country}</span>
                  ) : null}
                </div>
                <div className='col-md-4 mb-3'>
                  <label>State</label>
                  <select
                    className='custom-select d-block w-100'
                    name='state'
                    value={form.state}
                    onChange={handleChange}
                  >
                    <option value=''>Choose...</option>
                    <option>California</option>
                  </select>
                  {errMessage && errMessage.state ? (
                    <span className='error-message'>{errMessage.state}</span>
                  ) : null}
                </div>
                <div className='col-md-3 mb-3'>
                  <label>Zip</label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Enter Zip Code'
                    name='zip'
                    value={form.zip}
                    onChange={handleChange}
                  />
                  {errMessage && errMessage.zip ? (
                    <span className='error-message'>{errMessage.zip}</span>
                  ) : null}
                </div>
              </div>
              <hr className='mb-4' />
              <h4 className='mb-3'>Payment</h4>
              <div className='row'>
                <div className='col-md-6 mb-3'>
                  <label>Name on card</label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Enter Card Name'
                    name='cardName'
                    value={form.cardName}
                    onChange={handleChange}
                  />
                  {errMessage && errMessage.cardName ? (
                    <span className='error-message'>{errMessage.cardName}</span>
                  ) : null}
                </div>
                <div className='col-md-6 mb-3'>
                  <label>Credit card number</label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Enter Card Name'
                    name='cardNumber'
                    value={form.cardNumber}
                    onChange={handleChange}
                  />
                  {errMessage && errMessage.cardNumber ? (
                    <span className='error-message'>
                      {errMessage.cardNumber}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className='row'>
                <div className='col-md-3 mb-3'>
                  <label>Expiration</label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Expiration'
                    name='expiration'
                    value={form.expiration}
                    onChange={handleChange}
                  />
                  {errMessage && errMessage.expiration ? (
                    <span className='error-message'>
                      {errMessage.expiration}
                    </span>
                  ) : null}
                </div>
                <div className='col-md-3 mb-3'>
                  <label>CVV</label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='CVV'
                    name='cvv'
                    value={form.cvv}
                    onChange={handleChange}
                  />
                  {errMessage && errMessage.cvv ? (
                    <span className='error-message'>{errMessage.cvv}</span>
                  ) : null}
                </div>
              </div>
              <hr className='mb-4' />
              <button
                className='btn btn-primary btn-lg btn-block'
                type='submit'
              >
                Continue to checkout
              </button>
            </form>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default Checkout;
