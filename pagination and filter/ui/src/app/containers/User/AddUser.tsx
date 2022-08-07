import React, { Component, useReducer } from "react";
import { Button, Card, Row, Col, Form, InputGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  IAddUserState,
  IAddUserProps,
  IRootState,
  IUserData,
  ICorporateData,
  IUniversityData,
} from "../../../interfaces";
import { AppRoutes } from "../../../config";
import {
  addUserRequest,
  userInfoRequest,
  updateUserRequest,
  getUniversityRequest,
  getCorporationRequest,
} from "../../../actions";
import { userValidator } from "../../../validator";

class AddUser extends Component<IAddUserProps, IAddUserState> {
  constructor(props: IAddUserProps) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      university: "",
      corporate: "",
      errors: { 
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
        university: "",
        corporate: "",
      },
      isEditable: false,
      id: "",
      showPass: false
    };
  }

  componentDidMount = () => {
    const data = this.props.match.params as any;
    if (data.id) {
      this.props.viewUser(data);
      this.setState({
        isEditable: true,
      });
    }
    this.props.getUniversity();
    this.props.getCorporation();
  };
  componentDidUpdate = (prevProps: IAddUserProps,prevState:IAddUserState) => {
    const { userReducer:{userInfo:prevUserInfo} } = prevProps;
    const { userReducer:{userInfo:currentUserInfo} } = this.props;
    const data = this.props.match.params as any;
    if(data.id)
    {
      if(currentUserInfo && prevUserInfo !== currentUserInfo)
      {
        const {
          firstName,
          lastName,
          email,
          password,
          role,
          university,
          corporate,
          _id,
        } = currentUserInfo;
  
        this.setState({
          firstName,
          lastName,
          email,
          password,
          role,
          university,
          corporate,
          id: _id ? _id : "",
        });
      }
    }
    // const { userInfo } = this.props.userReducer;
    // if ( userReducer !== this.props.userReducer && data.id && userInfo) {
    
    // }
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: "",
      },
    });
  };

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(this.state,"checking for state inside sumbit")
    // const { state } = location;
    const {
      firstName,
      lastName,
      email,
      isEditable,
      password,
      role,
      university,
      corporate,
      id,
    } = this.state;

    const data = {
      firstName,
      lastName,
      email: email ? email.trim().toLowerCase() : "",
      password: password.slice(0, 8),
      role,
      university,
      corporate,
      _id: id,
    };

    // To validate form fields
    const { isValid, errors } = userValidator({
      ...data,
    });
  
    if (isValid) {
      if (isEditable) {
        this.props.updateUser({ ...data });
      } else {
        this.props.addUser(data);
      }
    } else {
      this.setState({
        errors,
      });
      return;
    }
    
  };
   togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    this.setState(
      {

        showPass:!this.state.showPass
      }
    )
  };
  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      university,
      corporate,
      errors,
      isEditable,
    } = this.state;
   
    console.log(this.state,"checking for state inside render ------")
    return (
      <div className="cr-page px-3 min-height650 my-profile-section">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <Card.Header>
                <h4>
                  <i className="icon-note" />
                  &nbsp;{!isEditable ? "Add" : "Update"} User
                </h4>
              </Card.Header>
              <Card.Body>
                <div className="row">
                  <div className="col-md-12  my-4">
                    <Form onSubmit={this.handleSubmit} className="row">
                      <Form.Group className="col-sm-6">
                        <Form.Label className="floating-label">
                          First Name<span className={"mandatory"}>*</span>
                          &nbsp;
                        </Form.Label>
                        <InputGroup>
                          <input
                            type={"text"}
                            name={"firstName"}
                            value={firstName}
                            className={"form-control floating-input"}
                            placeholder={" "}
                            onChange={this.handleChange}
                          />
                        </InputGroup>
                        <div className={"text-danger error-text"}>
                          {errors && errors.firstName}
                        </div>
                      </Form.Group>

                      <Form.Group className="col-sm-6">
                        <Form.Label className="floating-label">
                          Last Name<span className={"mandatory "}>*</span>
                          &nbsp;
                        </Form.Label>
                        <InputGroup>
                          <input
                            type={"text"}
                            name={"lastName"}
                            value={lastName}
                            className={"form-control floating-input"}
                            placeholder={" "}
                            onChange={this.handleChange}
                          />
                        </InputGroup>
                        <div className={"text-danger error-text"}>
                          {errors && errors.lastName}
                        </div>
                      </Form.Group>

                      <Form.Group className="col-sm-6">
                        <Form.Label className="floating-label">
                          Email Address<span className={"mandatory"}>*</span>
                          &nbsp;
                        </Form.Label>
                        <InputGroup>
                          <input
                            type={"text"}
                            name={"email"}
                            value={email}
                            className={"form-control floating-input"}
                            placeholder={" "}
                            onChange={this.handleChange}
                          />
                        </InputGroup>
                        <div className={"text-danger error-text"}>
                          {errors && errors.email}
                        </div>
                      </Form.Group>
                      {!isEditable ?
                      <Form.Group className="col-sm-6">
                        <Form.Label className="floating-label">
                          Password<span className={"mandatory"}>*</span>
                          &nbsp;
                        </Form.Label>
                        <InputGroup>
                          <input
                            type={this.state.showPass ? "text" : "password"}
                            name={"password"}
                            value={password}
                            className={"form-control floating-input"}
                            placeholder={" "}
                            onChange={this.handleChange}
                            disabled={!isEditable ? false : true}
                          />
                          <div className="showPass">
                            <i className="fa fa-eye" onClick={this.togglePassword} aria-hidden="true"/>
                          </div>

                        </InputGroup>
                        <div className={"text-danger error-text"}>
                          {errors && errors.password}
                        </div>
                      </Form.Group> : ''
                      }
                      <Form.Group className="col-sm-6">
                        <Form.Label className="floating-label">
                          User Type<span className={"mandatory"}>*</span>
                          &nbsp;
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            as="select"
                            aria-label="Default select example"
                            name={"role"}
                            value={role}
                            onChange={this.handleChange}
                          >
                            <option value="">Select User Type</option>
                            <option value="Individual">Individual</option>
                            <option value="Student">Student</option>
                            <option value="Corporate Employee">
                              Corporate Employee
                            </option>
                          </Form.Control>
                        </InputGroup>
                        <div className={"text-danger error-text"}>
                          {errors && errors.role}
                        </div>
                      </Form.Group>
                      {role === "Student" ? (
                        <Form.Group className="col-sm-6">
                          <Form.Label className="floating-label">
                            University<span className={"mandatory "}>*</span>
                            &nbsp;
                          </Form.Label>
                          <Form.Control
                            as="select"
                            aria-label="Default select example"
                            name={"university"}
                            value={university}
                            onChange={this.handleChange}
                          >
                            <option value="">Select University</option>
                            {this.props.userReducer &&
                            this.props.userReducer.universityData &&
                            this.props.userReducer.universityData.length
                              ? this.props.userReducer.universityData.map(
                                  (item: IUniversityData, index: number) => {
                                    return (
                                      <option value={item.name} key={index}>
                                        {item.name}
                                      </option>
                                    );
                                  }
                                )
                              : ""}
                          </Form.Control>
                          <div className={"text-danger error-text"}>
                            {errors && errors.university}
                          </div>
                        </Form.Group>
                      ) : (
                        ""
                      )}
                      {role === "Corporate Employee" ? (
                        <Form.Group className="col-sm-6">
                          <Form.Label className="floating-label">
                            Select Corporate
                            <span className={"mandatory "}>*</span>
                            &nbsp;
                          </Form.Label>
                          <Form.Control
                            as="select"
                            aria-label="Default select example"
                            name={"corporate"}
                            value={corporate}
                            onChange={this.handleChange}
                          >
                            <option value="">Select Corporate</option>
                            {this.props.userReducer &&
                            this.props.userReducer.corporateData &&
                            this.props.userReducer.corporateData.length
                              ? this.props.userReducer.corporateData.map(
                                  (itema: ICorporateData, index: number) => {
                                    return (
                                      <option value={itema.name}>
                                        {itema.name}
                                      </option>
                                    );
                                  }
                                )
                              : ""}
                          </Form.Control>
                          <div className={"text-danger error-text"}>
                            {errors && errors.corporate}
                          </div>
                        </Form.Group>
                      ) : (
                        ""
                      )}
                      <Col xs="12" className="text-right">
                        <Button
                          variant="button"
                          className="btn btn-danger"
                          onClick={() => {
                            this.props.history.push(AppRoutes.USER);
                          }}
                        >
                          {" "}
                          Cancel
                        </Button>
                        &nbsp;
                        <Button
                          variant="button"
                          type={"submit"}
                          className="btn btn-primary"
                        >
                          {!isEditable ? "Save" : "Update"}
                        </Button>
                      </Col>
                    </Form>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps: any = (state: IRootState) => ({
  userReducer: state.userReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getUniversity: () => {
      dispatch(getUniversityRequest());
    },
    getCorporation: () => {
      dispatch(getCorporationRequest());
    },
    addUser: (data: any) => {
      dispatch(addUserRequest(data));
    },
    viewUser: (data: IUserData) => {
      dispatch(userInfoRequest(data));
    }, 
    updateUser: (data: any) => {
      dispatch(updateUserRequest(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
