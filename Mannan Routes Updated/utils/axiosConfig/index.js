import axios from 'axios'
import { BASE_URL } from "config.js";
import successHandler from "./interceptors/successHandler";
import errorHandler from "./interceptors/errorHandler";
import { isLoading } from '../common/CommonService'

axios.defaults.baseURL = BASE_URL();
axios.defaults.customHeaders = true;
axios.defaults.defaultErrorHandler = true;
axios.defaults.headers.common["Authorization"] = localStorage["token"] ? `Bearer ${localStorage["token"]}` : "";
axios.interceptors.request.use(config => {
  // show loader
  isLoading.onNext(true);
  return config;
});
axios.interceptors.response.use(config => {
  // hide loader
  isLoading.onNext(false);
  return config;
});
axios.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error)
);