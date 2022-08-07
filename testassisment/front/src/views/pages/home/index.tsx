import { useEffect, useState } from "react";
import { Toaster } from "../../../helper/CommonServices";
import { AppRoutes } from "../../../routes/AppRoutes";
import { ApiHelper } from "../../../helper/ApiHelper/apiHelper";
import { ApiRoutes } from "../../../config";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import AppConfig from "../../../config/appConfig";
import { useStore } from "../../../store";

const Home = () => {
  const {setProfile, logout} = useStore();

  const clientId: any = AppConfig.GOOGLE_ID;

  const navigate = useNavigate();
  const [token, setToken] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  const responseGoogle = async (response: any) => {
    if (response && !response.error) {
      const authResponse: any = await new ApiHelper().FetchFromServer(
        ApiRoutes.GOOGLE_LOGIN.service,
        ApiRoutes.GOOGLE_LOGIN.url,
        ApiRoutes.GOOGLE_LOGIN.method,
        ApiRoutes.GOOGLE_LOGIN.authenticate,
        undefined,
        { accessToken: response.tokenId },
        undefined
      );
      if (authResponse && !authResponse.isError) {
        const token = authResponse.data.data.token;
        localStorage.setItem("token", token);
        setToken(token);
        const { givenName, familyName, email, imageUrl } = response.profileObj;
        const userValues = [
          {
            first_name: givenName,
            last_name: familyName,
            email: email,
            password: "N.A",
            confirm_password: "N.A",
            imageUrl: imageUrl,
          },
        ];
        localStorage.setItem("registeredUsers", JSON.stringify(userValues));
        Toaster({
          type: "success",
          text: authResponse.messages[0],
        });
        setProfile();
        navigate(AppRoutes.BOOK_LIST);
      } else {
        Toaster({
          type: "error",
          text: authResponse.messages[0],
        });
      }
    }
  };

  const handleLogout = () => {
    logout()
    setToken("");
  };

  return (
    <div className='main'>
      <div className='banner'>
        <div className='inner'>
          <h2>Login in with google</h2>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem ipsum is placeholder text commonly used in the
            graphic, print, and publishing industries for previewing layouts and
            visual mockups.
          </p>
          {!token ? (
            <GoogleLogin
              clientId={clientId}
              buttonText='Login with google'
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy='single_host_origin'
              className='big-btn'
              prompt="consent"
            />
          ) : (
            <Button variant='primary' size='lg' onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
