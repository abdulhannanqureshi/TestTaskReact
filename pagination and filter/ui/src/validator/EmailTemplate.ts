import Validator from "js-object-validation";
import { message } from "../app/common";

export const emailTemplateValidator = (data: any) => {
  const validations = {
    subject: {
      required: true,
    },
    content: {
      required: true,
      minlength: 20,
    },
  };
  // Error messages
  const messages = {
    subject: {
      required: message.Required.replace(":item", "Subject"),
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
