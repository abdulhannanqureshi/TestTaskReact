import Validator from 'js-object-validation';
import { message } from '../app/common';

export const transactionValidator = (data: any) => {
  let validations = {
    startDate: {
      required: true,
      
    },
    endDate: {
      required: true,
    },
  }
  // Error messages
  let messages = {
    startDate: {
      required: message.startDate,
     
    },
    endDate: {
      required: message.endDate,
    },
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
