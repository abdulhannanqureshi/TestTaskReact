import Validator from "js-object-validation";
import { message } from "../app/common";

export const subAdminValidator = (data: any) => {
  let validations = {
    firstName: {
      required: true,
      minlength: 3,
      maxlength:25
    },
    lastName: {
      required: true,
      minlength: 3,
      maxlength:25
    },
    email: {
      required: true,
      email: true,
    },
    password: {
      required: true,
      minlength: 8,
      maxlength:20
    },
    roleName: {
      required: true,
      minlength: 3,
      maxlength:30
    },
    rolesPermission: {
      required: true,
    },
  };
  // Error messages
  let messages = {
    firstName: {
      required: message.RequiredFirstName,
      minlength: message.MinLengthName.replace(":item", "First"),
      maxlength: message.MaxLengthName.replace(":item","First")
    },
    lastName: {
      required: message.RequiredLastName,
      minlength: message.MinLengthName.replace(":item", "Last"),
      maxlength: message.MaxLengthName.replace(":item","Last")
    },
    email: {
      required: message.RequiredEmail,
      email: message.InvalidEmail,
    },
    password: {
      required: message.RequiredPassword,
      minlength: message.MinLengthPassword,
      maxlength: message.MaxLengthPasssword
    },
    roleName: {
      required: message.RequiredRoleName,
      minlength: message.MinLengthRoleName.replace(":item", "Role"),
      maxlength: message.MaxLengthRoleName.replace(":item","Role")
    },
    rolesPermission: {
      required: message.RequiredRole,
    },
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
