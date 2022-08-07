import Validator from "js-object-validation";
import { message } from "../app/common";

export const corporateValidator = (data: any) => {
  let validations = {
    name: {
      required: true,
    },
  };
  // Error messages
  let messages = {
    name: {
      required: message.Corporate,
    },
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
