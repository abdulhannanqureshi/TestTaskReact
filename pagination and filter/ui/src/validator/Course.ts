import Validator from 'js-object-validation';
import { message } from '../app/common';

export const courseValidator = (data: any) => {
    const validations = {
      title: {
        required: true,
      },
      price: {
        required: true,
      },
      topic: {
        required: true,
      },                           
    };
    // Error messages
    const messages = {
      title: {
        required: message.Required.replace(':item', 'Course name'),
      },
      price: {
        required: message.Required.replace(':item', 'Amount'),
      },
      topic: {
        required: message.Required.replace(':item', 'Category'),
      },                       
    };
  
    const { isValid, errors } = Validator(data, validations, messages);
    return {
      isValid,
      errors,
    };
  };
  