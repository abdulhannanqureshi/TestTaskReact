import express from 'express';
import {
  login,
  adminDetails,
  adminProfile,
  adminChangePassword,
  forgotPassword,
  resetPassword,
  adminProxyLogin,
} from './../../controllers/superadmin';
import {
  LoginValidation,
  AdminProfileValidation,
  ChangePasswordValidation,
  ForgotPassValidation,
  ResetPasswordValidation,
} from '../../validations';
import { ValidateAdminToken } from '../../common';
const AuthRouter: express.Router = express.Router();

AuthRouter.post('/login', LoginValidation, login);
AuthRouter.get('/details', ValidateAdminToken, adminDetails);
AuthRouter.put('/update', ValidateAdminToken, AdminProfileValidation, adminProfile);
AuthRouter.put(
  '/change-password',
  ValidateAdminToken,
  ChangePasswordValidation,
  adminChangePassword,
);
AuthRouter.post('/admin-proxy-login', ValidateAdminToken, adminProxyLogin);
AuthRouter.post('/forgot-password', ForgotPassValidation, forgotPassword);
AuthRouter.put('/reset-password', ResetPasswordValidation, resetPassword);

export default AuthRouter;
