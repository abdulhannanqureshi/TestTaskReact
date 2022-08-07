/** @format */
import jwt from "jsonwebtoken";
import Mongoose from 'mongoose';
import { UserModel } from "../models";

export const verifyToken = async (req, res, next) => {
  // check header or url parameters or post parameters for token
  let token = req.headers["authorization"];

  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });
  // verifies secret and checks exp
  const tokenData = jwt.verify(
    token,
    process.env.JWT_SECRET
  )
  console.log('tokenData', tokenData);

  const currentUser = await UserModel.findOne({
    _id: Mongoose.Types.ObjectId(tokenData.id),
  });
  if (currentUser) {
    // if everything is good, save to request for use in other routes
    req.userId = tokenData.id;
    next();
  } else {
    return res.status(500).send({ auth: false, message: "Failed to authenticate token." });
  }


};