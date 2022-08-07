import errorHandler from "./errorHandler";
import { isLoading } from '../../common/CommonService'

const successHandler = (response) => {
  // if (response.data.success) return response.data;
  // else {
  //   response.status = response.data.code;
  //   return errorHandler({response})
  // }
  isLoading.onNext(false);
  if (response.status < 300) return response.data;
  else {
    response.status = response.data.code;
    return errorHandler({response})
  }
  
};
export default successHandler;