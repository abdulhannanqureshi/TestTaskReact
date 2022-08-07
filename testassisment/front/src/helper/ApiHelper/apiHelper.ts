import Axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { ErrorHandlerHelper } from "./errorHandlerHelper";
import { SuccessHandlerHelper } from "./successHandlerHelper";
import AppConfig from "../../config/appConfig";
/**
 * ApiHelper Class - For making Api Requests
 *
 */
let CancelToken = Axios.CancelToken;
let cancel: any;

export class ApiHelper {
  _portalGateway;
  _apiVersion;

  constructor() {
    this._portalGateway = AppConfig.API_ENDPOINT;
    this._apiVersion = "";
    // this.source = Axios.CancelToken.source();
    // this.cancelToken = this.source.token;
  }
  setHost = (host: string) => {
    this._portalGateway = host;
  };
  setApiVersion = (version: string) => {
    this._apiVersion = version;
  };
  /**
   * Fetches from the Gateway defined by the instantiated object. Accepts <T> as output object.
   * @example <caption>"/Auth/UserAccount", "/GetCurrentUser", "GET", "JWT Content"</caption>
   * @param {service} service - wanting to be access ex. "UserAuth/Auth"
   * @param {endpoint} endpoint - you wish to call ex. "/Login"
   * @param {method} mehotd - method (GET, UPDATE, DELETE, POST)
   * @param {jwt} JWT - JSON Web Token (Optional)
   * @param {queryOptions} Query - query options for "GET" methods (Optional)
   * @param {body} body - JSON body for "UPDATE, DELETE and POST" methods (Optional)
   */
  async FetchFromServer(
    service: string,
    endpoint: string,
    method: any,
    authenticated: boolean = false,
    queryOptions: any = undefined,
    body: any = undefined,
    responseType: any
  ) {
    let options: AxiosRequestConfig<any> = { method: method };
    let url: string = this._portalGateway + service + endpoint;
    options.headers = { "Content-Type": "application/json" };
    if (authenticated) {
      const storageSession = localStorage.getItem("token") || "";
      options.headers.Authorization = storageSession;
    }
    try {
      method: method = method.toLowerCase() as Method;
      let response: any = await Axios.request({
        method,
        url,
        data: body,
        headers: options.headers,
        params: queryOptions,
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
      });

      if (response.ok === false || response.status !== 200) {
        let errorObject = {
          code: response.status,
          data: response.data,
        };

        throw errorObject;
      }
      const data = new SuccessHandlerHelper(response.data);
      return data.data;
    } catch (err: any) {
      if (Axios.isCancel(err) || !err.response) {
        return {
          isError: true,
          error: "Request cancelled",
          messages: err.message === "cancel" ? [] : ["Request cancelled"],
        };
      } else {
        const errorHelper = new ErrorHandlerHelper(err.response);
        return errorHelper.error;
      }
    }
  }
  /**
   * Cancels the last request.
   */
  cancelRequest = (err: any) => {
    cancel && cancel(err);
  };
}
