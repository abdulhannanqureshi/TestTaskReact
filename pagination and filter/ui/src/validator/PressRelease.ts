import Validator from 'js-object-validation';
import { message } from '../app/common';

export const pressReleaseValidator = (data: any) => {
  const validations = {
    category: {
      required: true,
    },
    title: {
      required: true,
    },
    description: {
      required: true,
      minlength:20
    },
  };
  // Error messages
  const messages = {
    category: {
      required: message.Required.replace(":item", "Category"),
    },
    title: {
      required: message.Required.replace(":item", "Title"),
    },
    description: {
      required: message.Required.replace(":item", "Description"),
      minlength:message.MinLength.replace(":item","Description")
    },
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
