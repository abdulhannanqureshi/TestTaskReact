import Validator from "js-object-validation";
import { message } from "../app/common";

export const FrontendTemplateValidator = (data: any) => {
  const validations = {
    title: {
      required: true,
    },
    content: {
      required: true,
      minlength: 20,
    },
  };
  // Error messages
  const messages = {
    title: {
      required: message.Required.replace(":item", "Template Name"),
    },
    content: {
      required: message.Required.replace(":item", "Template body"),
      minlength: message.MinLength.replace(":item", "Template body"),
    },
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
