import Validator from 'js-object-validation';
// import ValidationTypes from "js-object-validation";
import { message } from '../app/common';

export const blogCategoryValidator = (data: any) => {
  const validations = {
    categoryName: {
      required: true,
    },
  };
  // Error messages
  const messages = {
    categoryName: {
      required: message.RequiredCategoryName,
    },
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
