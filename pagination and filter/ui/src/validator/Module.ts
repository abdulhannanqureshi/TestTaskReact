import Validator from 'js-object-validation';
import { message } from '../app/common';

export const moduleValidator = (data: any) => {
    const validations = {
      moduleName: {
        required: true,
      },
      course: {
        required: true,
      },
      amount: {
        required: true,
      },
    };
    // Error messages
    const messages = {
      moduleName: {
        required: message.Required.replace(":item", "Module name"),
      },
      course: {
        required: message.Required.replace(":item", "Course"),
      },
      amount: {
        required: message.Required.replace(":item", "Amount"),
      },
    };
  
    const { isValid, errors } = Validator(data, validations, messages);
    return {
      isValid,
      errors,
    };
  };
  