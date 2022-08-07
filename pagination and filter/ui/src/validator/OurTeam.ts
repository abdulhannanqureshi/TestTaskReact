import Validator from "js-object-validation";
import { message } from "../app/common";

export const OurTeam = (data: any) => {
  const validations = {
    firstName: {
      required: true,
      minlength:3
    },
    lastName: {
      required: true,
      minlength:3
    },
    teamMemberImage: {
      required: true,
    },
    // email: {
    //   required: true,
    //   email: true,
    // },
    designation: {
      required: true,
    },
    // order: {
    //   required: true,
    //   numeric:true,
    // },
    aboutUs: {
      required: true,
      minlength:20
    },
  };
  // Error messages
  const messages = {
    firstName: {
      required: message.RequiredFirstName,
      minlength: message.MinLengthName.replace(":item","First")
    },
    lastName: {
      required: message.RequiredLastName,
    },
    teamMemberImage: {
      required: message.Required.replace(":item", "Image"),
      minlength: message.MinLengthName.replace(":item","Last")
    },
    // email: {
    //   required: message.RequiredEmail,
    //   email: message.InvalidEmail,
    // },
    designation: {
      required: message.RequiredDesignation,
    },
    // order: {
    //   required: message.Required.replace(":item","Order Number"),
    //   numeric:message.InvalidOrder,
    // },
    aboutUs: {
      required: message.Required.replace(":item","About us"),
      minlength:message.MinLength.replace(":item","About us")
    },
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
