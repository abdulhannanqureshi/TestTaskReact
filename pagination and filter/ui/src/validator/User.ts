import Validator from 'js-object-validation';
import { Left } from 'react-bootstrap/lib/Media';
import { message } from '../app/common';

export const userValidator = (data: any) => {
  let validations = {
    firstName: {
      required: true,
      minlength:3,
      maxlength:25
    },
    lastName: {
      required: true,
      minlength:3,
      maxlength:25
    },
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minlength: 8,
      maxlength:20
    },
    role: {
      required: true,
    },
    university: {},
    corporate: {},
  };
  if(data.role === 'Student') {
    validations.university = {
      required: true,
    }
  }
  if(data.role === 'Corporate Employee') {
    validations.corporate = {
      required: true,
    }
  }
  // Error messages
  let messages = {
    firstName: {
      required: message.RequiredFirstName,
      minlength: message.MinLengthName.replace(":item","First"),
      maxlength: message.MaxLengthName.replace(":item","First")
    },
    lastName: {
      required: message.RequiredLastName,
      minlength: message.MinLengthName.replace(":item","Last"),
      maxlength: message.MaxLengthName.replace(":item","Last")
    },
    email: {
      required: message.RequiredEmail,
      email: message.InvalidEmail,
    },
    password:{
      required: message.RequiredPassword,
      minlength: message.MinLengthPassword,
      maxlength: message.MaxLengthPasssword
    },
    role:{
      required: message.Required.replace(":item", "User type"),
    },
    university:{
      required: message.Required.replace(":item", "University"),
    },
    corporate:{
      required: message.Required.replace(":item", "Corporate"),
    }
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
