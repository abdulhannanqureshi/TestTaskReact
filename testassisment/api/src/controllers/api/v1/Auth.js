/** @format */

import jwt from 'jsonwebtoken';
const { OAuth2Client } = require('google-auth-library');
import { UserModel } from "../../../models";
import { Messages } from "../../../common";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


/**
 * @api {post} /api/v1/auth/google-login  Auth - Google login
 * @apiName Auth - Google login
 * @apiGroup Auth
 * @apiPermission none
 * @apiDescription Login with google
 * @apiParam {String} accessToken Access token of google account
 * @apiSuccess {String} accessToken Access token of google account
 */
const googleLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    client.verifyIdToken({ idToken: accessToken, audience: process.env.GOOGLE_CLIENT_ID }).then(async (response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        const checkExist = await UserModel.findOne({ email });
        let token, userId;
        if (checkExist) {
          await UserModel.update(
            { _id: checkExist._id },
            { $set: { lastLoginAt: new Date() } }
          );
          userId = checkExist._id;
        }
        else {
          const createdUserData = await UserModel.create({ name, email });
          userId = createdUserData._id;
        }
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        });
        return res.status(200).json({
          message: Messages.LoginSuccess,
          data: { token, email, name },
        });
      }
      else {
        return res.status(422).json({
          message: response.error.message,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export default {
  googleLogin,
};