import { Request, Response } from 'express';
import { Document, Types } from 'mongoose';
const TalentLMS: any = require('talentlms');
import moment from 'moment';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message, Email } from '../../common';
import {
  CourseModel,
  EmailTemplateModel,
  LabsModel,
  ModuleModel,
  PromoModel,
  SettingModel,
  TransactionModel,
  UserModel,
} from '../../models';
import Mongoose from 'mongoose';
import { AddLabValidation } from '../../validations';

//import { json } from 'stream/consumers';

/**
 -----------------------
       CHECKOUT
 -----------------------
 */
/**
 * @api {post} transaction/  Add Checkout
 * @apiName checkout
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription Add API for Payment Checkout
 * @apiParam {String} cardNumber Card Number of the User.
 * @apiParam {String} cardExpMonth card Expire Month of the User.
 * @apiParam {String} cardExpYear card Expire Year of the User.
 * @apiParam {String} cardCvc card Cvc of the User.
 * @apiParam {String} cardName card Name of the User.
 * @apiParam {String} discountedAmount discounted amount by promo apply
 * @apiParam {String} subTotal Sub total amount
 * @apiParam {String} grandTotal Grand Total amount to pay
 * @apiParam {String} promoId promo id
 * @apiParam {String} moduleId module id
 * @apiParamExample {Object} Request-Example:
 {
  "email": "jon@mailinator.com",
    "name":"jon snow",
  "cardNumber":"4242424242424242",
    "cardExpMonth":"10",
   "cardExpYear":"2025",
     "cardCvc":"123",
     "cardName":"visa",
     "promoId":null,
     "moduleId":"61481ae333b1e429a80c5c60",
     "subTotal":null,
     "grandTotal":null,
     "discountedAmount":null
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Checkout Successfully.',
 *   responseCode: 200,
 *   data: result,
 * }
 * @apiErrorExample {json} List error


 *    HTTP/1.1 500 Internal Server Error
 */
const checkout = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      body,
      currentUser = {
        _id: '',
        role: '',
        firstName: '',
        lastName: '',
        talentLmsUserId: '',
      },
    } = req;

    const {
      email,
      name,
      isCompleteCourse,
      courseId,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      cardName,
      promoId,
      moduleId = [],
      siteDiscount,

      address_city = 'null',
      address_country = 'US',
      address_line1 = 'null',
      address_line2 = 'null',
      address_state = 'null',
      address_zip = '555225',
    } = body;

    let promoDetail: any;
    let amount: Number | any = 0;
    let module: Document[] | null | any;
    for (const iterator of moduleId) {
      let moduleAmount: Number | any = 0;
      if (iterator.courseId === null) {
        return res.status(400).json({
          code: 400,
          success: false,
          message: 'Course is Required',
        });
      }
      if (iterator.moduleIds !== null) {
        const isPurchased: Document[] | null | any =
          await TransactionModel.findOne({
            $and: [
              {
                userId: currentUser._id,
              },
              {
                moduleId: {
                  $in: iterator.moduleIds.map(function (value: any) {
                    return Mongoose.Types.ObjectId(value);
                  }),
                },
              },
            ],
          });

        if (isPurchased) {
          return res.status(400).json({
            code: 400,
            success: false,
            message:
              'Some Modules you have already purchased, Please check your purchased list before purchase',
          });
        }

        module = await ModuleModel.find({
          _id: {
            $in: iterator.moduleIds.map(function (value: any) {
              return Mongoose.Types.ObjectId(value);
            }),
          },
          isActive: true,
          isDeleted: false,
        });

        for (const iterator of module) {
          moduleAmount += iterator.amount;
        }
      }

      if (iterator.labId !== null) {
        const checkLabPurchased: Document | null | any =
          await TransactionModel.findOne({
            $and: [
              {
                userId: currentUser._id,
              },
              {
                labId: iterator.labId,
              },
              {
                courseId: iterator.courseId,
              },
            ],
          });
        if (checkLabPurchased) {
          return res.status(400).json({
            code: 400,
            success: false,
            message:
              'Some Modules you have already purchased, Please check your purchased list before purchase',
          });
        }
        let lab: Document | any = await LabsModel.findOne({
          _id: iterator.labId,
          isActive: true,
          isDeleted: false,
        });
        if (lab) {
          moduleAmount += lab.amount;
        }
      }
      if (iterator.isCourseComplete === true) {
        const course: Document | any = await CourseModel.findOne({
          _id: iterator.courseId,
          isActive: true,
          isDeleted: false,
        }).lean();
        if (course) {
          moduleAmount = parseInt(course.price);
        }
        // if (iterator.moduleIds.length === 4) {
        //   moduleAmount = 1000;
        // }
        // if (iterator.moduleIds.length === 8) {
        //   moduleAmount = 2000;
        // }
      }

      amount += moduleAmount;
    }

    body.subTotal = (parseFloat(amount) + parseFloat(siteDiscount)).toFixed(2);
    body.grandTotal = amount.toFixed(2);
    body.discountedAmount = (0).toFixed(2);
    if (promoId) {
      promoDetail = await PromoModel.findOne({
        _id: promoId,
        isActive: true,
        isDeleted: false,
      });
      body.promoDetail = JSON.stringify(promoDetail);
      body.discountedAmount = ((amount * promoDetail.percentOff) / 100).toFixed(
        2
      );
      body.subTotal = (parseFloat(amount) + parseFloat(siteDiscount)).toFixed(
        2
      );
      body.grandTotal = (amount - body.discountedAmount).toFixed(2);
    }
    // Add a new card of the customer
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        cvc: cardCvc,
        name: cardName,
        // address_city ,
        address_country,
        address_line1,
        //  address_line2,
        //  address_state,
        //  address_zip,
      },
    });

    try {
      const charge = await stripe.charges.create({
        amount: Math.round(body.grandTotal * 100),
        currency: 'usd',
        source: cardToken.id,
        receipt_email: email,
        description: `Stripe Charge Of Amount ${body.grandTotal} for One Time Payment`,
      });

      if (charge.status === 'succeeded') {
        let tlmsCourseId: any = [];

        for (const iterator of moduleId) {
          let courseDuration: any;
          const course: Document | any = await CourseModel.findOne({
            _id: iterator.courseId,
            isActive: true,
            isDeleted: false,
          }).lean();
          if (course.price === '0') {
            const globalSetting: Document | null | any =
              await SettingModel.findOne();
            courseDuration = globalSetting.moduleDuration;
          } else {
            const globalSetting: Document | null | any =
              await SettingModel.findOne();
            courseDuration = globalSetting.courseDuration;
          }

          let moduleData: Document[] | null | any;
          if (iterator.moduleIds !== null) {
            moduleData = await ModuleModel.find({
              _id: {
                $in: iterator.moduleIds.map(function (value: any) {
                  return Mongoose.Types.ObjectId(value);
                }),
              },
              isActive: true,
              isDeleted: false,
            });
          }
          if (moduleData && moduleData.length > 0) {
            for (const moduleIterator of moduleData) {
              await tlmsCourseId.push(
                moduleIterator.talentLmsCourseId.toString()
              );
            }
          }

          let transactionObj: Object | any = {
            transactionId: charge.balance_transaction,
            chargeId: charge.id,
            siteDiscount,
            moduleId: iterator.moduleIds,
            courseId: iterator.courseId,
            labId: iterator.labId,
            userId: currentUser._id,
            promoId: promoId ? promoId : null,
            promoCode: promoId ? promoDetail.promoCode : '',
            subTotal: body.subTotal,
            grandTotal: body.grandTotal,
            discountedAmount: body.discountedAmount,
            expireDate: moment(Date.now()).add(courseDuration, 'days'),
            //expireDate: moment(Date.now()).add(2, 'days'),
          };
          const transactionData: Document = new TransactionModel(
            transactionObj
          );
          const result: any = await transactionData.save();
        }
        try {
          const talentLMS = new TalentLMS(
            process.env.TALENTLMSURL,
            process.env.TALENTLMSAPIKEY
          );
          const userDetails = await UserModel.findOne({
            _id: currentUser._id,
          });

          if (tlmsCourseId.length > 0) {
            await tlmsCourseId.map((item: any) => {
              const obj: any = {
                course_id: item,
                user_id: userDetails.talentLmsUserId,
                user_type: 'Learner_Type',
              };
              try {
                let addUserInTlmsCourse: Document | any =
                  talentLMS.Courses.addUserToCourse(obj);
                console.log('addUserInTlmsCourse', addUserInTlmsCourse);
              } catch (error) {
                console.log('error', error);
              }
            });
          }
        } catch (error) {
          console.log('error', error);
        }
        try {
          //    email template for registration
          const availableTemplate: any = await EmailTemplateModel.findOne({
            templateName: {
              $regex: new RegExp('paymentSuccess'.trim(), 'i'),
            },
          });

          if (availableTemplate) {
            const upperCaseFirstName =
              `${currentUser.firstName}`.charAt(0).toUpperCase() +
              `${currentUser.firstName}`.slice(1);
            const upperCaseLastName =
              `${currentUser.lastName}`.charAt(0).toUpperCase() +
              `${currentUser.lastName}`.slice(1);

            const fullName:
              | string
              | any = `${upperCaseFirstName} ${upperCaseLastName}`;

            const emailInstance: any = new Email(req);
            await emailInstance.setTemplate(
              availableTemplate.subject,
              availableTemplate.htmlContent,
              {
                name: fullName,
                email,
                amount: body.grandTotal,
              }
            );
            await emailInstance.sendEmail(email);
          }
        } catch (error) {
          return res.status(400).json({
            responseCode: 400,
            message:
              error instanceof Error && error.message ? error.message : '',
          });
        }

        return res.status(200).json({
          message: message.paymentSuccess,
          responseCode: 200,
          data: { charge },
        });
      } // if
      res.status(500).json({
        message: message.paymentFailure,
        success: false,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error instanceof Error && error.message
            ? error.message
            : message.unexpectedError,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};
const checkout1 = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      body,
      currentUser = {
        _id: '',
        role: '',
        firstName: '',
        lastName: '',
        talentLmsUserId: '',
      },
    } = req;

    const {
      email,
      name,
      isCompleteCourse,
      courseId,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      cardName,
      promoId,
      moduleId = [],

      address_city = 'null',
      address_country = 'US',
      address_line1 = 'null',
      address_line2 = 'null',
      address_state = 'null',
      address_zip = '555225',
    } = body;
    let promoDetail: any;
    let amount: Number | any = 0;
    let moduleAmount: Number | any = 0;
    let module: Document[] | null | any;
    for (const iterator of moduleId) {
      // const checkLabPurchased: Document | null | any =
      //   await TransactionModel.findOne({
      //     $and: [
      //       {
      //         userId: currentUser._id,
      //       },
      //       {
      //         labId: iterator.labId,
      //       },
      //       {
      //         courseId: iterator.courseId,
      //       },
      //     ],
      //   });
      //   if (checkLabPurchased) {

      //   return res.status(400).json({
      //     code: 400,
      //     success: false,
      //     message:
      //       'Some Modules you have already purchased, Please check your purchased list before purchase',
      //   });
      // }
      const isPurchased: Document[] | null | any =
        await TransactionModel.findOne({
          $and: [
            {
              userId: currentUser._id,
            },
            {
              moduleId: {
                $in: iterator.moduleIds.map(function (value: any) {
                  return Mongoose.Types.ObjectId(value);
                }),
              },
            },
          ],
        });

      if (isPurchased) {
        return res.status(400).json({
          code: 400,
          success: false,
          message:
            'Some Modules you have already purchased, Please check your purchased list before purchase',
        });
      }

      module = await ModuleModel.find({
        _id: {
          $in: iterator.moduleIds.map(function (value: any) {
            return Mongoose.Types.ObjectId(value);
          }),
        },
        isActive: true,
        isDeleted: false,
      });
      // let tlmsCourseId: any = [];
      for (const iterator of module) {
        moduleAmount += iterator.amount;
        // await tlmsCourseId.push(iterator.talentLmsCourseId.toString());
        console.log('iteratoriterator', iterator);
      }

      // if (
      //   iterator.labId != 'null' ||
      //   iterator.labId != null ||
      //   iterator.labId !== 'null' ||
      //   iterator.labId !== null
      // ) {
      //   let lab: Document | any = await LabsModel.findOne({
      //     _id: iterator.labId,
      //     isActive: true,
      //     isDeleted: false,
      //   });
      //   if (lab) {
      //     moduleAmount += lab.amount;
      //   }
      // }
      if (
        iterator.isCompleteCourse === 'true' ||
        iterator.isCompleteCourse === true
      ) {
        if (iterator.moduleIds.length === 4) {
          moduleAmount = 1000;
        }
        if (iterator.moduleIds.length === 8) {
          moduleAmount = 2000;
        }
      }

      amount += moduleAmount;
    }

    body.subTotal = amount.toFixed(2);
    body.grandTotal = amount.toFixed(2);
    body.discountedAmount = (0).toFixed(2);
    if (promoId) {
      promoDetail = await PromoModel.findOne({
        _id: promoId,
        isActive: true,
        isDeleted: false,
      });
      body.promoDetail = JSON.stringify(promoDetail);
      body.discountedAmount = ((amount * promoDetail.percentOff) / 100).toFixed(
        2
      );
      body.subTotal = amount.toFixed(2);
      body.grandTotal = (amount - body.discountedAmount).toFixed(2);
    }
    // Add a new card of the customer
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        cvc: cardCvc,
        name: cardName,
        // address_city ,
        address_country,
        address_line1,
        //  address_line2,
        //  address_state,
        //  address_zip,
      },
    });

    try {
      const charge = await stripe.charges.create({
        amount: Math.round(body.grandTotal * 100),
        currency: 'usd',
        source: cardToken.id,
        receipt_email: email,
        description: `Stripe Charge Of Amount ${body.grandTotal} for One Time Payment`,
      });

      if (charge.status === 'succeeded') {
        let courseDuration: any;
        const globalSetting: Document | null | any =
          await SettingModel.findOne();
        courseDuration = globalSetting.courseDuration;
        for (const iterator of moduleId) {
          let tlmsCourseId: any = [];
          for (const moduleIterator of module) {
            await tlmsCourseId.push(
              moduleIterator.talentLmsCourseId.toString()
            );
          }

          let transactionObj: Object | any = {
            transactionId: charge.balance_transaction,
            chargeId: charge.id,
            moduleId: iterator.moduleIds,
            // labId: iterator.labId,
            userId: currentUser._id,
            promoId: promoId ? promoId : null,
            promoCode: promoId ? promoDetail.promoCode : '',
            subTotal: body.subTotal,
            grandTotal: body.grandTotal,
            discountedAmount: body.discountedAmount,
            expireDate: moment(Date.now()).add(courseDuration, 'days'),
            //expireDate: moment(Date.now()).add(2, 'days'),
          };
          const transactionData: Document = new TransactionModel(
            transactionObj
          );
          const result: any = await transactionData.save();
          try {
            const userDetails = await UserModel.findOne({
              _id: currentUser._id,
            });
            /////Commeting for testing purpose
            const talentLMS = new TalentLMS(
              process.env.TALENTLMSURL,
              process.env.TALENTLMSAPIKEY
            );
            for (let index = 0; index < tlmsCourseId.length; index++) {
              const obj: any = {
                course_id: tlmsCourseId[index],
                user_id: userDetails.talentLmsUserId,
                user_type: 'Learner_Type',
              };
              let addUserInTlmsCourse: Document | any =
                await talentLMS.Courses.addUserToCourse(obj);
              console.log('addUserInTlmsCourse', addUserInTlmsCourse);
            }
            /////Commeting for testing purpose
          } catch (error) {
            console.log('error', error);
          }
        }

        try {
          // email template for registration
          const availableTemplate: any = await EmailTemplateModel.findOne({
            templateName: {
              $regex: new RegExp('paymentSuccess'.trim(), 'i'),
            },
          });

          if (availableTemplate) {
            const fullName:
              | string
              | any = `${currentUser.firstName} ${currentUser.lastName}`;
            const emailInstance: any = new Email(req);
            await emailInstance.setTemplate(
              availableTemplate.subject,
              availableTemplate.htmlContent,
              {
                name: fullName,
                email,
                amount: body.subTotal,
              }
            );
            // await emailInstance.sendEmail(email);
          }
        } catch (error) {
          return res.status(400).json({
            responseCode: 400,
            message:
              error instanceof Error && error.message ? error.message : '',
          });
        }

        return res.status(200).json({
          message: message.paymentSuccess,
          responseCode: 200,
          data: { charge },
        });
      } // if
      res.status(500).json({
        message: message.paymentFailure,
        success: false,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error instanceof Error && error.message
            ? error.message
            : message.unexpectedError,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};
const checkoutOld = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      body,
      currentUser = {
        _id: '',
        role: '',
        firstName: '',
        lastName: '',
        talentLmsUserId: '',
      },
    } = req;

    const {
      email,
      name,
      isCompleteCourse,
      courseId,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      cardName,
      promoId,
      moduleId = [],

      address_city = 'null',
      address_country = 'US',
      address_line1 = 'null',
      address_line2 = 'null',
      address_state = 'null',
      address_zip = '555225',
    } = body;
    const isPurchased: Document[] | null | any = await TransactionModel.findOne(
      {
        $and: [
          {
            userId: currentUser._id,
          },
          {
            moduleId: { $in: moduleId },
          },
        ],
      }
    );
    if (isPurchased) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: message.alreadyPurchased,
      });
    }

    let promoDetail: any;
    const module: Document[] | null | any = await ModuleModel.find({
      _id: { $in: moduleId },
      isActive: true,
      isDeleted: false,
    });
    console.log('module', module);
    let amount: Number | any = 0;

    let tlmsCourseId: any = [];
    for (const iterator of module) {
      amount += iterator.amount;
      await tlmsCourseId.push(iterator.talentLmsCourseId.toString());
    }
    if (isCompleteCourse === 'true' || isCompleteCourse === true) {
      if (moduleId.length === 4) {
        amount = 1000;
      }
      if (moduleId.length === 8) {
        amount = 2000;
      }
    }
    body.subTotal = amount.toFixed(2);
    body.grandTotal = amount.toFixed(2);
    body.discountedAmount = (0).toFixed(2);
    if (promoId) {
      promoDetail = await PromoModel.findOne({
        _id: promoId,
        isActive: true,
        isDeleted: false,
      });
      body.promoDetail = JSON.stringify(promoDetail);
      body.discountedAmount = ((amount * promoDetail.percentOff) / 100).toFixed(
        2
      );
      body.subTotal = amount.toFixed(2);
      body.grandTotal = (amount - body.discountedAmount).toFixed(2);
    }

    // Add a new card of the customer
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        cvc: cardCvc,
        name: cardName,
        // address_city ,
        address_country,
        address_line1,
        //  address_line2,
        //  address_state,
        //  address_zip,
      },
    });

    try {
      const charge = await stripe.charges.create({
        amount: Math.round(body.grandTotal * 100),
        currency: 'usd',
        source: cardToken.id,
        receipt_email: email,
        description: `Stripe Charge Of Amount ${body.grandTotal} for One Time Payment`,
      });

      if (charge.status === 'succeeded') {
        let courseDuration: any;
        const globalSetting: Document | null | any =
          await SettingModel.findOne();
        courseDuration = globalSetting.courseDuration;
        let transactionObj: Object = {
          transactionId: charge.balance_transaction,
          chargeId: charge.id,
          moduleId,
          userId: currentUser._id,
          promoId: promoId ? promoId : null,
          promoCode: promoId ? promoDetail.promoCode : '',
          subTotal: body.subTotal,
          grandTotal: body.grandTotal,
          discountedAmount: body.discountedAmount,
          expireDate: moment(Date.now()).add(courseDuration, 'days'),
          //expireDate: moment(Date.now()).add(2, 'days'),
        };
        const transactionData: Document = new TransactionModel(transactionObj);
        const result: any = await transactionData.save();
        try {
          const userDetails = await UserModel.findOne({
            _id: currentUser._id,
          });

          // const talentLMS = new TalentLMS(
          //   process.env.TALENTLMSURL,
          //   process.env.TALENTLMSAPIKEY
          // );
          // for (let index = 0; index < tlmsCourseId.length; index++) {
          //   const obj: any = {
          //     course_id: tlmsCourseId[index],
          //     user_id: userDetails.talentLmsUserId,
          //     user_type: 'Learner_Type',
          //   };
          //   let addUserInTlmsCourse: Document | any =
          //     await talentLMS.Courses.addUserToCourse(obj);
          //   console.log('addUserInTlmsCourse', addUserInTlmsCourse);
          // }
        } catch (error) {
          console.log('error', error);
          //To remove user from tlms course
          // const removeUserToCourse: Document | any =
          //   await talentLMS.Courses.removeUserFromCourse(course_id, user_id);
        }
        try {
          // email template for registration
          const availableTemplate: any = await EmailTemplateModel.findOne({
            templateName: {
              $regex: new RegExp('paymentSuccess'.trim(), 'i'),
            },
          });

          if (availableTemplate) {
            const fullName:
              | string
              | any = `${currentUser.firstName} ${currentUser.lastName}`;
            const emailInstance: any = new Email(req);
            await emailInstance.setTemplate(
              availableTemplate.subject,
              availableTemplate.htmlContent,
              {
                name: fullName,
                email,
                amount: body.subTotal,
              }
            );
            // await emailInstance.sendEmail(email);
          }
        } catch (error) {
          return res.status(400).json({
            responseCode: 400,
            message:
              error instanceof Error && error.message ? error.message : '',
          });
        }

        return res.status(200).json({
          message: message.paymentSuccess,
          responseCode: 200,
          data: { charge, result },
        });
      } // if
      res.status(500).json({
        message: message.paymentFailure,
        success: false,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error instanceof Error && error.message
            ? error.message
            : message.unexpectedError,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};

/**
 -----------------------
    APPLY PROMO CODE
 -----------------------
 */
/**
 * @api {post} transaction/applyPromo     Add Promo code when checkout
 * @apiName applyPromo
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription Add API for Promo code
 * @apiParam {String} promoId promo id
 * @apiParam {String} moduleId module id
 * @apiParamExample {Object} Request-Example:
 {

    //  "promoId":"61481ae333b1e429a80c5c61",
    //  "courseId":"61481ae333b1e429a80c5c55",
    //  "moduleId":["61481ae333b1e429a80c5c60"],

       "promoCode":"60Off",
     "moduleId":[[{"isCompleteCourse":true,"moduleIds":["6180df1076bf864a3fe80e37","6180df1176bf864a3fe80e41","6180df1176bf864a3fe80e56","6180df1176bf864a3fe80e5e"]}],
    [{"isCompleteCourse":true,"moduleIds":["6180df1076bf864a3fe80e37","6180df1176bf864a3fe80e41","6180df1176bf864a3fe80e56","6180df1176bf864a3fe80e5e"]}]]
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Promo code added successfully.',
 *   responseCode: 200,
 *   data: { discountedAmount, subTotal, grandTotal, promoId }
 * }
 * @apiErrorExample {json} List error


 *    HTTP/1.1 500 Internal Server Error
 */

const applyPromo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body } = req;

    const {
      promoCode,
      moduleId,
      siteDiscount,
      courseId,
      isCompleteCourse,
    }: string | any = body;
    let promo: Document | null | any;
    // console.log('moduleId', moduleId);
    console.log(siteDiscount, 'siteDiscountsiteDiscountsiteDiscount');
    promo = await PromoModel.findOne({
      promoCode: promoCode,
      courseId: null,
      isActive: true,
      isDeleted: false,
    });

    if (moduleId.length === 1) {
      // if (moduleId[0].moduleIds !== null) {
      // let course: Document | any = await ModuleModel.findOne({
      //   _id: {
      //     $in: moduleId[0].moduleIds.map(function (value: any) {
      //       return Mongoose.Types.ObjectId(value);
      //     }),
      //   },
      //   isActive: true,
      //   isDeleted: false,
      // });
      // course = course.course;

      promo = await PromoModel.findOne({
        promoCode: promoCode,
        courseId: moduleId[0].courseId,
        isActive: true,
        isDeleted: false,
      });
      // }
      //  else {
      //   promo = await PromoModel.findOne({
      //     promoCode: promoCode,
      //     courseId: null,
      //     isActive: true,
      //     isDeleted: false,
      //   });
      // }
    }
    if (promo === null) {
      return res.status(404).json({
        message: 'Invalid Promo Code',
        responseCode: 404,
        success: false,
      });
    }

    let startDate = new Date(promo.startDate).setHours(0, 0, 0, 0);
    let endDate = new Date(promo.endDate).setHours(0, 0, 0, 0);
    let currentDate = new Date().setHours(0, 0, 0, 0);

    if (startDate > currentDate) {
      return res.status(401).json({
        message: message.inactivePromoCode,
        responseCode: 401,
        success: false,
      });
    }
    if (endDate < currentDate) {
      return res.status(401).json({
        message: message.itemExpired.replace(':item', 'Promo Code'),
        responseCode: 401,
        success: false,
      });
    }

    let discountedAmount: any;
    let subTotal: any;
    let grandTotal: any;
    let promoId: any;
    let amount: any = 0;

    for (const iterator of moduleId) {
      let moduleAmount: any = 0;
      if (iterator.moduleIds != null) {
        const module: Document | null | any = await ModuleModel.aggregate([
          {
            $match: {
              _id: {
                $in: iterator.moduleIds.map(function (value: any) {
                  return Mongoose.Types.ObjectId(value);
                }),
              },
              isActive: true,
              isDeleted: false,
            },
          },
          { $group: { _id: null, amount: { $sum: '$amount' } } },
        ]);
        moduleAmount = module[0].amount;
        console.log(moduleAmount, 'moduleAmount moduleIds');
      }
      if (iterator.labId != null) {
        let lab: Document | any = await LabsModel.findOne({
          _id: iterator.labId,
          isActive: true,
          isDeleted: false,
        });
        if (!iterator.isCourseComplete === true) {
          moduleAmount += lab.amount;
          console.log(moduleAmount, 'moduleAmount labIds');
        }
      }
      if (iterator.isCourseComplete === true) {
        const course: Document | any = await CourseModel.findOne({
          _id: iterator.courseId,
          isActive: true,
          isDeleted: false,
        }).lean();
        if (course) {
          moduleAmount = parseInt(course.price);
        }
        // if (iterator.moduleIds.length === 4) {
        //   moduleAmount = 1000;
        // }
        // if (iterator.moduleIds.length === 8) {
        //   moduleAmount = 2000;
        // }
        console.log(moduleAmount, 'moduleAmount Complete Course');
      }
      amount += moduleAmount;
    }

    console.log(amount, 'amount new');

    if (promo) {
      discountedAmount = promo.percentOff;
      subTotal = parseFloat(amount) + parseFloat(siteDiscount);
      discountedAmount = (amount / 100) * discountedAmount;
      grandTotal = amount - discountedAmount;
      grandTotal = parseFloat(grandTotal.toFixed(2));

      discountedAmount = parseFloat(discountedAmount.toFixed(2));

      promoId = promo._id;

      console.log(discountedAmount, 'discountedAmount Promo');
    }

    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'Promo Code'),
      responseCode: 200,
      data: {
        discountedAmount,
        subTotal,
        grandTotal,
        promoId,
        percentOff: promo.percentOff ? promo.percentOff : '0',
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};

const applyPromo1 = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body } = req;

    const { promoCode, moduleId, courseId, isCompleteCourse }: string | any =
      body;

    let discountedAmount: any;
    let subTotal: any;
    let grandTotal: any;
    let promoId: any;

    const module: Document | null | any = await ModuleModel.aggregate([
      {
        $match: {
          _id: {
            $in: moduleId.map(function (value: any) {
              return Mongoose.Types.ObjectId(value);
            }),
          },
          isActive: true,
          isDeleted: false,
        },
      },
      { $group: { _id: null, amount: { $sum: '$amount' } } },
    ]);
    let amount: any = module[0].amount;

    console.log('amount', amount);
    if (isCompleteCourse === 'true' || isCompleteCourse === true) {
      if (moduleId.length === 4) {
        amount = 1000;
      }
      if (moduleId.length === 8) {
        amount = 2000;
      }
    }

    const promo: Document | null | any = await PromoModel.findOne({
      promoCode: promoCode,
      courseId: Types.ObjectId(courseId),
      isActive: true,
      isDeleted: false,
    });

    if (promo === null) {
      return res.status(404).json({
        message: 'Invalid Promo Code',
        responseCode: 404,
        success: false,
      });
    }
    if (promo.startDate >= moment().toDate()) {
      console.log('inactive');
      return res.status(401).json({
        message: message.inactivePromoCode,
        responseCode: 401,
        success: false,
      });
    }
    if (promo.endDate <= moment().toDate()) {
      console.log('expire');

      return res.status(401).json({
        message: message.itemExpired.replace(':item', 'Promo Code'),
        responseCode: 401,
        success: false,
      });
    }
    if (promo) {
      discountedAmount = promo.percentOff;
      subTotal = parseFloat(amount);
      discountedAmount = (amount / 100) * discountedAmount;
      grandTotal = amount - discountedAmount;
      grandTotal = parseFloat(grandTotal.toFixed(2));

      discountedAmount = parseFloat(discountedAmount.toFixed(2));

      promoId = promo._id;
    }

    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'Promo Code'),
      responseCode: 200,
      data: {
        discountedAmount,
        subTotal,
        grandTotal,
        promoId,
        percentOff: promo.percentOff ? promo.percentOff : '0',
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};

/**
 -----------------------
       CHECKOUT
 -----------------------
 */
/**
 * @api {post} transaction/  Add Payment
 * @apiName addUser
 * @apiGroup SuperAdmin
 * @apiPermission none
 * @apiDescription Add API for Payment
 * @apiParam {String} email Email of the User.
 * @apiParam {String} name name of the User.
 * @apiParamExample {Object} Request-Example:
 {
   "email": "jon@mailinator.com",
    "name":"jon snow",
  "cardNumber":"4242424242424242",
    cardExpMonth":"10",
   "cardExpYear":"2025",
     "cardCvc":"123",
    "cardName":"Visa",
     "country":"india"
     }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Checkout Successfully.',
 *   responseCode: 200,
 *   data: result,
 * }
 * @apiErrorExample {json} List error


 *    HTTP/1.1 500 Internal Server Error
 */
const checkoutWithCardSave = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body } = req;
    const {
      email,
      name,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      cardName,
      country,
    } = body;

    // Create a new customer for stripe
    const customer = await stripe.customers.create({
      email: email,
      name: name,
      address: {
        line1: '510 mg road ',
        postal_code: '455117',
        city: 'dewas',
        state: 'madhyapradesh',
        country: 'india',
      },
      // promo:"w2vjfUlW"
    });

    // Add a new card of the customer
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        cvc: cardCvc,
        name: cardName,
        address_country: country,
      },
    });
    let amount = 1000; // 500 inr

    const card = await stripe.customers.createSource(customer.id, {
      source: `${cardToken.id}`,
    });

    const charge = await stripe.charges.create({
      amount: amount,
      currency: 'inr',
      source: card.id,
      receipt_email: email,
      customer: customer.id,
      description: `Stripe Charge Of Amount ${
        amount / 100
      } for One Time Payment`,
    });

    return res.status(200).json({
      message: 'Checkout Successfully',
      responseCode: 200,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};
// get list of cards of customer
const getCardListOfUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body } = req;
    const customerId = 'cus_KBOUEzcXYO8fc7'; //body.customerId
    let cards: any = [];
    const savedCards = await stripe.customers.listSources(customerId, {
      object: 'card',
    });
    const cardDetails: any = Object.values(savedCards.data);

    cardDetails.forEach(
      (cardData: {
        id: any;
        brand: any;
        exp_month: any;
        exp_year: any;
        last4: any;
      }) => {
        let obj = {
          cardId: cardData.id,
          cardType: cardData.brand,
          cardExpDetails: `${cardData.exp_month}/${cardData.exp_year}`,
          cardLast4: cardData.last4,
        };
        cards.push(obj);
      }
    );
    return res.status(200).json({
      message: 'Checkout Successfully',
      responseCode: 200,
      data: cards,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};

/**
 ----------------------------
     GET ALL TRANSACTION
 ----------------------------
 */

/**
 * @api {get} transaction/  Get Transaction list of user
 * @apiName getTransaction
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch Transaction details of user
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Transaction list fetched successfully",
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getTransactionList = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query, currentUser = { _id: '' } } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    const skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    const fromDate: any = query.fromDate || '';
    const toDate: any = query.toDate || '';
    let condition: object = { userId: currentUser._id };
    let sort: any = { createdAt: -1 };

    if (searchValue) {
      condition = {
        ...condition,
        $or: [
          {
            fullName: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            'user.email': {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          // {
          //   'module.moduleName': {
          //     $regex: new RegExp(searchValue.trim(), 'i'),
          //   },
          // },
          {
            transactionId: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            grandTotal: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            subTotal: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            discountedAmount: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            promoCode: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
        ],
      };
    }
    if (limit === 'all') {
      // Sort user name by A-Z
      limit = '0';
    }

    let dateCondition = {};
    if (fromDate != null && toDate != null) {
      dateCondition = {
        $gte: moment(fromDate).toDate(),
        $lte: moment(toDate).toDate(),
      };
    }
    if (fromDate && toDate) {
      condition = {
        ...condition,
        createdAt: dateCondition,
      };
    }
    // if (isActive !== '') {
    //   condition = { ...condition, isActive };
    // }
    if (isActive === 'true') {
      condition = { ...condition, isActive: true };
    }
    if (isActive === 'false') {
      condition = { ...condition, isActive: false };
    }
    // const totalRecords: number = await TransactionModel.countDocuments({
    //   ...condition,

    // });
    const result: Document[] = await TransactionModel.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: '_id',
          localField: 'userId',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'modules',
          as: 'module',
          foreignField: '_id',
          localField: 'moduleId',
        },
      },
      // {
      //   $unwind: '$module',
      // },
      {
        $addFields: {
          fullName: {
            $concat: [
              '$user.firstName',
              ' ',
              //  { $ifNull: ['$middleName', ''] },
              // ' ',
              '$user.lastName',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$transactionId',
          // courses: {
          //   $addToSet: '$course',
          // },
          fullName: {
            $first: '$fullName',
          },
          user: {
            $first: '$user',
          },
          module: {
            $addToSet: '$module',
          },
          transactionId: {
            $first: '$transactionId',
          },
          expireDate: {
            $first: '$expireDate',
          },
          promoCode: {
            $first: '$promoCode',
          },
          subTotal: {
            $first: '$subTotal',
          },
          grandTotal: {
            $first: '$grandTotal',
          },
          discount: {
            $first: '$siteDiscount',
          },
          userId: {
            $first: '$userId',
          },
          discountedAmount: {
            $first: '$discountedAmount',
          },
        },
      },

      {
        $match: condition,
      },

      { $sort: { _id: -1 } }, // Use this to sort documents by newest first
      { $skip: parseInt(skip) }, // Always apply 'skip' before 'limit'
      { $limit: parseInt(limit) }, // This is your 'page size'
    ]);
    console.log('result', result);
    const totalRecords: Document[] | any = await TransactionModel.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: '_id',
          localField: 'userId',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'modules',
          as: 'module',
          foreignField: '_id',
          localField: 'moduleId',
        },
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              '$user.firstName',
              ' ',
              //  { $ifNull: ['$middleName', ''] },
              // ' ',
              '$user.lastName',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$transactionId',
          // courses: {
          //   $addToSet: '$course',
          // },
          fullName: {
            $first: '$fullName',
          },
          user: {
            $first: '$user',
          },
          module: {
            $addToSet: '$module',
          },
          transactionId: {
            $first: '$transactionId',
          },
          expireDate: {
            $first: '$expireDate',
          },
          promoCode: {
            $first: '$promoCode',
          },
          subTotal: {
            $first: '$subTotal',
          },
          discount: {
            $first: '$siteDiscount',
          },
          grandTotal: {
            $first: '$grandTotal',
          },
          discountedAmount: {
            $first: '$discountedAmount',
          },
          userId: {
            $first: '$userId',
          },
        },
      },

      {
        $match: condition,
      },

      {
        $count: 'count',
      },
    ]);
    return res.status(200).json({
      responseCode: 200,
      success: true,
      message: message.listFetchSuccess.replace(':item', 'Transaction'),
      data: result,
      totalRecords:
        totalRecords && totalRecords.length ? totalRecords[0].count : 0,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};

export {
  checkoutWithCardSave,
  getCardListOfUser,
  checkout,
  applyPromo,
  getTransactionList,
};
