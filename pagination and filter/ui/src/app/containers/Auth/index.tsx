import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  Button,
  Card,
  CardGroup,
  Row,
  Col,
  Container,
  Form,
  InputGroup
} from "react-bootstrap";
import {
  ILoginState,
  ILoginProps,
  IRootState,
  ILoginActionData
} from "../../../interfaces";
import { loginValidator } from "../../../validator";
import { LoginRequest } from "../../../actions";
import logo from './../../../assets/img/brand-logo.png';
import { User ,Lock} from 'react-feather';

class Login extends Component<ILoginProps, ILoginState> {
  toastId: any = null;
  constructor(props: ILoginProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {
        email: "",
        password: "",
      },
      showPass: false,
    };
  }
  componentDidMount() {
    if (localStorage.getItem("token") && this.props.redirectTo) {
      this.props.redirectTo({ path: "/dashboard" });
    }
  }
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
    const { email, password } = this.state;
    const data = {
      email: email ? email.trim().toLowerCase() : "",
      password,
    };
    // To validate form fields
    const { isValid, errors } = loginValidator(data);
    if (isValid) {
      await this.props.onLogin(data);
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
    this.setState({
      showPass: !this.state.showPass,
    });
  };

  render() {
    const { email, password, errors } = this.state;
    return (
      <div className='app flex-row align-items-center'>
        <Container>
          <Row className='justify-content-center'>
            <Col md='5'>
              <div className={"d-flex justify-content-center p-3"}>
                <img src={logo} height={60} alt='' />
              </div>
              <CardGroup>
                <Card className='p-4'>
                  <Card.Body>
                    <Form onSubmit={this.handleSubmit}>
                      <h1 className={"d-flex justify-content-center"}>Login</h1>
                      <p className={"d-flex justify-content-center text-muted"}>
                        Sign In to your account
                      </p>
                      <Form.Group>
                        <InputGroup>
                          <InputGroup.Prepend>
                            <InputGroup.Text
                              id='inputGroupPrepend'
                              className={"input-group-text-theme"}
                            >
                              <User />
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control
                            type={"text"}
                            name={"email"}
                            value={email}
                            className={"form-control-theme"}
                            placeholder={"Enter email"}
                            onChange={this.handleChange}
                          />
                        </InputGroup>
                        <div className={"text-danger"}>
                          {errors && errors.email}
                        </div>
                      </Form.Group>
                      <Form.Group>
                        <InputGroup>
                          <InputGroup.Prepend>
                            <InputGroup.Text
                              id='inputGroupPrepend'
                              className={"input-group-text-theme"}
                            >
                              <Lock />
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control
                            type={this.state.showPass ? "text" : "password"}
                            name={"password"}
                            value={password}
                            className={"form-control-theme"}
                            placeholder={"Enter Password"}
                            onChange={this.handleChange}
                          />
                          <div className='showPass'>
                            <i
                              className='fa fa-eye'
                              onClick={this.togglePassword}
                              aria-hidden='true'
                            />
                          </div>
                        </InputGroup>
                        <div className={"text-danger"}>
                          {errors && errors.password}
                        </div>
                      </Form.Group>
                      <Row>
                        <Col
                          xs='12'
                          className={"d-flex justify-content-center"}
                        >
                          <Button
                            type={"submit"}
                            color='primary'
                            className={"w-100"}
                            size={"lg"}
                          >
                            Login
                          </Button>
                        </Col>
                        {/* <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            Forgot password?
                          </Button>
                        </Col> */}
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps: any = (state: IRootState) => ({
  loginReducer: state.loginReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onLogin: (data: ILoginActionData) => {
      dispatch(LoginRequest(data));
    }
  };
};
/**
 *
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
