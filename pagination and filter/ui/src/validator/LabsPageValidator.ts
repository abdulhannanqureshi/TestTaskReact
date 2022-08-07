import Validator from "js-object-validation";
import { message } from "../app/common";

export const Labs = (data: any) => {
  const validations = { 
    title: {
      required: true,
    },
    link: {
      required: true,
    },
    labsImage: {
      required: true,
    },
    amount: {
      required: true,
      numeric:true,
     
    },
    course:
    {
      required:true
    },
    description:
    {
      required:true,
      minlength:20
     
    },
  };
  // Error messages
  const messages = {
    title: {
      required: message.Requiredtitle,
    },
    amount: {
      required: message.Requiredamount,
      numeric:message.InvalidNumber,
    },
    labsImage: {
      required: message.Required.replace(":item", "Image"),
    },
    link: {
      required: message.Requiredlink,
    },
    course:
    {
      required:message.RequiredCourse 
    },
    description:
    {
      required: message.Required.replace(":item", "Description"),
      minlength: message.MinLength.replace(":item", "Description"),
    },
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
