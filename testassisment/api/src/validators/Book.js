/** @format */

const Yup = require("yup");
import { Messages } from "../common";

const searchBook = {
  search: Yup.string()
    .trim()
    .required(Messages.Required.replace(":item", "Search")),
};

module.exports = {
  searchBook,
};
