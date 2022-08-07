import Validator from 'js-object-validation';
import { message } from '../app/common';

export const settingValidator = (data: any) => {
  let validations = {
    courseDuration: {
      required: true,
    },
    moduleDuration: {
      required: true,
    },
    certificateAmount: {
      required: true,
    },
    facebook: {
      required: true,
    },
    twitter: {
      required: true,
    },
    linkedin: {
      required: true,
    },
    pinterest: {
      required: true,
    },
    phone: {
      required: true,
      numeric: true,
      maxlength: 20,
      minlength: 9,
    },
    email: {
      required: true,
    },
    headOfficeAddress: {
      required: true,
    },
  };
  // Error messages
  let messages = {
    courseDuration: {
      required: message.Required.replace(":item", "Course duration"),
    },
    moduleDuration: {
      required: message.Required.replace(":item", "Micro Course duration"),
    },
    certificateAmount: {
      required: message.Required.replace(":item", "Course Amount"),
    },
    facebook: {
      required: message.Required.replace(":item", "Facebook"),
    },
    twitter: {
      required: message.Required.replace(":item", "Twitter"),
    },
    linkedin: {
      required: message.Required.replace(":item", "Linkedin"),
    },
    pinterest: {
      required: message.Required.replace(":item", "Pinterest"),
    },
    phone: {
      required: message.Required.replace(":item", "Phone"),
      numeric: message.InvalidNumber,
      maxlength: message.maxLengthNumber,
      minlength: message.minLengthNumber,
    },
    email: {
      required: message.Required.replace(":item", "Email"),
    },
    headOfficeAddress: {
      required: message.Required.replace(":item", "Head office address"),
    },
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
