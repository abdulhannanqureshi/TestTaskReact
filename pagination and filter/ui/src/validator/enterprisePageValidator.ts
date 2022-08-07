import Validator from "js-object-validation";
import { message } from "../app/common";

export const enterprisePageValidator = (data: any) => {
  const validations = {
    blockTitle1: {
      required: true,
      minlength: 3,
    },
    blockTitle2: {
      required: true,
      minlength: 3,
    },
    blockTitle3: {
      required: true,
      minlength: 3,
    },
    blockTitle4: {
      required: true,
      minlength: 3,
    },
    blockTitle5: {
      required: true,
      minlength: 3,
    },
    blockTitle6: {
      required: true,
      minlength: 3,
    },
    blockTitle7: {
      required: true,
      minlength: 3,
    },
    blockTitle8: {
      required: true,
      minlength: 3,
    },
    blockTitle9: {
      required: true,
      minlength: 3,
    },
    blockTitle10: {
      required: true,
      minlength: 3,
    },
    blockTitle11: {
      required: true,
      minlength: 3,
    },
    blockTitle12: {
      required: true,
      minlength: 3,
    },
    blockTitle13: {
      required: true,
      minlength: 3,
    },
  
    blockImage1: {
      required: true,
    },
    blockImage2: {
      required: true,
    },
    blockImage3: {
      required: true,
    },
    blockImage4: {
      required: true,
    },
    blockImage5: {
      required: true,
    },
    blockImage6: {
      required: true,
    },
    blockImage7: {
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
   
    block3: {
      required: true,
      minlength: 20,
    },
    
    block4: {
      required: true,
      minlength: 20,
    },
    block5: {
      required: true,
      minlength: 20,
    },
    block6: {
      required: true,
      minlength: 20,
    },
    block7: {
      required: true,
      minlength: 20,
    },
   
  };
  // Error messages
  const messages = {
    blockTitle1: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle2: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle3: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle4: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle5: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle6: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle7: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle8: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle9: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle10: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle11: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle12: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
    blockTitle13: {
      required: message.Required.replace(":item", "Title"),
      minlength: message.MinLengthTitle.replace(":item", "Title"),
    },
   
    blockImage1: {
      required: message.Required.replace(":item", "Image"),
    },
    blockImage2: {
      required: message.Required.replace(":item", "Image"),
    },
    blockImage3: {
      required: message.Required.replace(":item", "Image"),
    },
    blockImage4: {
      required: message.Required.replace(":item", "Image"),
    },
    blockImage5: {
      required: message.Required.replace(":item", "Image"),
    },
    blockImage6: {
      required: message.Required.replace(":item", "Image"),
    },
    blockImage7: {
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
    block3: {
      required: message.Required.replace(":item", "Content"),
      minlength: message.MinLength.replace(":item", "Content"),
    },
    
    block4: {
      required: message.Required.replace(":item", "Content"),
      minlength: message.MinLength.replace(":item", "Content"),
    },
    block5: {
      required: message.Required.replace(":item", "Content"),
      minlength: message.MinLength.replace(":item", "Content"),
    },
    block6: {
      required: message.Required.replace(":item", "Content"),
      minlength: message.MinLength.replace(":item", "Content"),
    },
    block7: {
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
