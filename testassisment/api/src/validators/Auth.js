/** @format */

const Yup = require("yup");
import { Messages } from "../common";

const googleLogin = {
  accessToken: Yup.string()
    .trim()
    .required(Messages.Required.replace(":item", "Access token")),
};

module.exports = {
  googleLogin,
};
