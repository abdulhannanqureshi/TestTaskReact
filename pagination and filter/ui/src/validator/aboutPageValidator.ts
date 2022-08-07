import Validator from "js-object-validation";
import { message } from "../app/common";

export const aboutPageValidator = (data: any) => {
  const validations = {
    title: {
      required: true,
      minlength: 3,
    },
    bannerTitle: {
      required: true,
      minlength: 20,
    },
    blockTitle1: {
      required: true,
      minlength: 3,
    },
    blockTitle2: {
      required: true,
      minlength: 3,
    },
    blockImage1: {
      required: true,
    },
    block1: {
      required: true,
      minlength: 20,
    },
    block2: {
      required: true,
      minlength: 20,
    },
  };
  // Error messages
  const messages = {
    title: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    bannerTitle: {
      required: message.Required.replace(":item", "Content"),
      minlength: message.MinLength.replace(":item", "Content"),
    },
    blockTitle1: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle2: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockImage1: {
      required: message.Required.replace(":item", "Image"),
    },
    block1: {
      required: message.Required.replace(":item", "Content"),
      minlength: message.MinLength.replace(":item", "Content"),
    },
    block2: {
      required: message.Required.replace(":item", "Content"),
      minlength: message.MinLength.replace(":item", "Content"),
    },
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
