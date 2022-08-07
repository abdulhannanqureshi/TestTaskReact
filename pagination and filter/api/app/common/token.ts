import { UserModel } from './../models';
import Mongoose from 'mongoose';
import { IUserTokenData } from './../interfaces';
import { sign as JWTSign, verify as VerifyJWT } from 'jsonwebtoken';
import { JWTSecrete } from './password';
import { Request, NextFunction, Response } from 'express';

/**
 *
 */
export const GenerateToken = async (data: IUserTokenData): Promise<string> => {
  return new Promise((resolve, reject) => {
    JWTSign(
      data,
      JWTSecrete,
      {
        expiresIn: 86400,
      },
      (err: any, token: any) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
};

/**
 *
 */

export const ValidateAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token: string = req.headers['authorization']
    ? req.headers['authorization'].toString()
    : '';
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized, Please provide authentication token!',
    });
  }
  try {
    const tokenData: IUserTokenData = VerifyJWT(
      token,
      JWTSecrete
    ) as IUserTokenData;
    const currentUser: Document | null | any = await UserModel.findOne({
      _id: Mongoose.Types.ObjectId(tokenData.id),
      role: { $in: ['Superadmin', 'Admin'] },
      isActive: true,
      isDeleted: false,
    });
    req.currentUser = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      // message: 'Token has expired',
    });
  }
};

/**
 * User Token
 */
export const ValidateUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token: string = req.headers['authorization']
    ? req.headers['authorization'].toString()
    : '';
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized, Please provide authentication token!',
    });
  }
  try {
    const tokenData: IUserTokenData = VerifyJWT(
      token,
      JWTSecrete
    ) as IUserTokenData;
    const currentUser: Document | null | any = await UserModel.findOne({
      _id: Mongoose.Types.ObjectId(tokenData.id),
      isActive: true,
      isDeleted: false,
    });
    if (currentUser) {
      if(tokenData.email != currentUser.email) {
        return res.status(402).json({
          message: 'Email has been changed, please login with new email.',
        });
      }
      else {
        req.currentUser = currentUser;
        req.currentUser = currentUser;
        next();
      }
    } else {
      return res.status(402).json({
        message: 'Invalid token',
      });
    }
  } catch (error) {
    return res.status(402).json({
      message: 'Your login session has been expired, Please login again.',
    });
  }
};
