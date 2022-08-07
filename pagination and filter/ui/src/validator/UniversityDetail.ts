import Validator from 'js-object-validation';

import { message } from '../app/common';

export const universityValidator = (data: any) => {
  let validations = {
    name: {
      required: true,
    },
  }
  // Error messages
  let messages = {
    name: {
      required: message.University,
    },
   
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
