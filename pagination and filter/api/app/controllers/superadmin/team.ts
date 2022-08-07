import { Request, Response } from 'express';
import * as fastCsv from 'fast-csv';
import fs from 'fs';
import path from 'path';

import { TeamModel, EmailTemplateModel } from '../../models';
import { message, Email, checkEmail } from '../../common';
import { Document, Types } from 'mongoose';
import moment from 'moment';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';

import Mongoose from 'mongoose';

/**
 -----------------------
    ADD TEAM MEMBER
 -----------------------
 */
/**
 * @api {post} team/  Add Team Member
 * @apiName addTeamMember
 * @apiGroup SuperAdmin
 * @apiPermission team
 * @apiDescription Add API for Team Member
 * @apiParam {String} email Email of the  Team Member.
 * @apiParam {String} firstName firstName of the  Team Member.
 * @apiParam {String} lastName lastName of the Team Member.
 * @apiParam {String} designation Designation of the Team Member.
 * @apiParam {String} aboutUs About of the Team Member.
 * @apiParamExample {Object} Request-Example:
{
   "firstName": "jon",
    "lastName": "snow",
    "email": "jon@mailinator.com",
    "designation": "manager",
    "aboutUs": "i am a manager",

}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:' Team Member added successfully.',
 *   responseCode: 200,
 *   data: result,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 emailExist
 * {
 *    message:'This Email Address is already registered with us. Please try to register with another Email Address.',
 *  responseCode: 400,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const addTeamMember = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, file } = req;
    const { firstName, lastName, email, designation, aboutUs } = body;

    // const { valid, reason, validators } = await checkEmail(email);
    // if (!valid) {
    //   return res.status(400).send({
    //     message: 'Please provide a valid email address.',
    //     code: 400,
    //     success: false,
    //   });
    // }
    // const teams: Document | null | any = await TeamModel.findOne({
    //   email: {
    //     $regex: new RegExp(email.trim(), 'i'),
    //   },
    //   isDeleted: false,
    // });
    const team: Document | null | any = await TeamModel.find(
      { isDeleted: false },
      { order: 1 }
    );
    // let order: any = parseInt(body.order);
    // console.log('team', team);
    // let orderItems: any = [];
    // for (const iterator of team) {
    //   orderItems.push(iterator.order);
    // }
    const order: any = team.length + 1;
    // if (order == 0 || order > totalTeam || orderItems.includes(order)) {
    //   return res.status(400).json({
    //     code: 400,
    //     message: 'Something Went Wrong in Order, Please Check',
    //     success: false,
    //   });
    // }

    const data: object = {
      firstName,
      lastName,
      email,
      order,
      designation,
      aboutUs,
      teamMemberImage: file ? `uploads/team/${file.filename}` : '',
    };
    const teamData: Document = new TeamModel(data);

    const result: any = await teamData.save();

    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'Team Member'),
      responseCode: 200,
      data: result,
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

/**
 -------------------------
   GET ALL TEAM MEMBERS
 -------------------------
 */

/**
 * @api {get} team/  Get Team list
 * @apiName getTeam
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch teams details
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message: "Team list fetched successfully"
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getTeam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    let skip: any = query.skip || 1;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    const fromDate: any = query.fromDate || '';
    const toDate: any = query.toDate || '';
    // const role: any = query.role || 'Individual';
    let condition: object = {};
    let sort: any = { createdAt: -1 };
    skip = (skip - 1) * limit;

    if (limit === 'all') {
      limit = '0';
    }
    if (searchValue) {
      condition = {
        ...condition,
        $or: [
          {
            firstName: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            lastName: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            email: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
        ],
      };
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
    if (isActive === 'true') {
      condition = { ...condition, isActive: true };
    }
    if (isActive === 'false') {
      condition = { ...condition, isActive: false };
    }
    const totalRecords: number = await TeamModel.countDocuments({
      ...condition,
      isDeleted: false,
    });
    const result: Document[] = await TeamModel.find({
      ...condition,
      isDeleted: false,
    }).sort({ order:1 });
    // .skip(parseInt(skip))
    // .limit(parseInt(limit));

    return res.status(200).json({
      message: message.listFetchSuccess.replace(':item', 'Team'),
      success: true,
      responseCode: 200,
      data: result,
      totalRecords,
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
const updateTeamByOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body } = req;
    const { updateOrder } = body;

    // let updateOrder = [
    //   {
    //     label: '6228a37800c99c43ee85305a',
    //     value: 3,
    //   },
    //   {
    //     label: '6228a38300c99c43ee85305f',
    //     value: 2,
    //   },
    //   {
    //     label: '6228a38f00c99c43ee853065',
    //     value: 0,
    //   },
    // ];

    let orderItems: any = [];
    let count: any = 0;
    for (const iterator of updateOrder) {
      orderItems.push(iterator.value);
    }
    const toFindDuplicates: any = (orderItems: any) =>
      orderItems.filter(
        (item: any, index: any) => orderItems.indexOf(item) !== index
      );
    const duplicateElement = toFindDuplicates(orderItems);
    if (duplicateElement.length > 0) {
      return res.status(400).json({
        code: 400,
        message: 'Something Went Wrong in Order, Please Check',
        success: false,
      });
    }
    for (const iterator of updateOrder) {
      if (iterator.value > updateOrder.length || iterator.value == 0) {
        //check = true;

        return res.status(400).json({
          code: 400,
          message: 'Something Went Wrong in Order, Please Check',
          success: false,
        });
      } else {
        const data: any = await TeamModel.updateOne(
          {
            _id: Mongoose.Types.ObjectId(iterator.lable),
          },
          {
            $set: {
              order: iterator.value,
            },
          }
        );
        count++;
      }
    }

    // const role: any = query.role || 'Individual';

    // if (isActive === 'false') {
    //   condition = { ...condition, isActive: false };
    // }

    return res.status(200).json({
      message: 'Team Order Updated Successfully',
      success: true,
      responseCode: 200,
      // data: result,
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

/**
 ---------------------------
  VIEW TEAM MEMBER DETAILS
 ---------------------------
 */

/**
 * @api {get} team/:id  Team Member details
 * @apiName viewTeam
 * @apiGroup SuperAdmin
 * @apiPermission team
 * @apiDescription To fetch Team Member profile details
 * @apiParam {String} _id id of the Team Member.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message: "Team Member details fetched successfully"
 *    responseCode: 200
 *    data: result
 *    success: true
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 404 NotFound
 * {
 *    message: "Data not found.",
 *  responseCode: 404,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const viewTeam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await TeamModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (result === null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Team Member'),
        success: true,
      });
    }
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Team Member'),
      responseCode: 200,
      data: result,
      success: true,
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

/**
 -----------------------
   UPDATE TEAM MEMBER
 -----------------------
 */
/**
 * @api {put} team/:id  Update Team Member
 * @apiName updateTeam
 * @apiGroup SuperAdmin
 * @apiPermission team
 * @apiDescription Update API for Team Member
 * @apiParam {String} email Email of the Team Member.
 * @apiParam {String} firstName firstName of the Team Member.
 * @apiParam {String} lastName lastName of the Team Member.
 * @apiParam {String} designation designation of the Team Member.
 * @apiParam {String} aboutUs About of the Team Member.
 * @apiParamExample {Object} Request-Example:
{
   "firstName": "jon",
    "lastName": "snow",
    "email": "jon@mailinator.com",
    "designation": "manager",
    "aboutUs": "i am a manager",
    "dropTeamMemberImage": "true",

}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Team Member details updated successfully.',
 *   responseCode: 200,
 *   data: result,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 emailExist
 * {
 *    message:'Email address already exist',
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const updateTeam = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, params } = req;
    const {
      firstName,
      lastName,
      email,
      designation,
      aboutUs,
      dropTeamMemberImage,
    } = body;
    // let order: any = parseInt(body.order);
    // const { valid, reason, validators } = await checkEmail(email);
    // if (!valid) {
    //   return res.status(400).send({
    //     message: 'Please provide a valid email address.',
    //     code: 400,
    //     success: false,
    //   });
    // }
    const { id }: string | any = params;

    // const emailExist: Document | any = await TeamModel.findOne({
    //   email: email,
    //   isDeleted: false,
    //   _id: { $ne: id },
    // });
    // if (emailExist) {
    //   return res.status(400).json({
    //     message: message.emailExist,
    //     success: false,
    //   });
    // }
    const team: Document | any = await TeamModel.findOne({
      _id: id,
    });
    // const teams: Document | null | any = await TeamModel.find(
    //   { isDeleted: false },
    //   { order: 1 }
    // );

    // let orderItems: any = [];
    // for (const iterator of teams) {
    //   orderItems.push(iterator.order);
    // }

    // if (order == 0 || order > teams.length || orderItems.includes(order)) {
    //   return res.status(400).json({
    //     code: 400,
    //     message: 'Something Went Wrong in Order, Please Check',
    //     success: false,
    //   });
    // }

    let teamMemberImage: String = team.teamMemberImage;

    if (req.file) {
      const file = req.file;
      teamMemberImage = `uploads/team/${file.filename}`;
    }

    if (dropTeamMemberImage === 'true' || dropTeamMemberImage === true) {
      teamMemberImage = '';
    }
    const result: Document = await TeamModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          firstName,
          lastName,
          email,
          // order,
          teamMemberImage,
          designation,
          aboutUs,
        },
      },
      { runValidators: true }
    );

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.updateSuccess.replace(':item', 'Team Member'),
      success: true,
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

/**
 -----------------------------
    UPDATE TEAM MEMBER STATUS
 -----------------------------
 */
/**
 * @api {put} /team/update-status/:id     Update Team Member status
 * @apiName updateTeamStatus
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Team Member Status
 * @apiParam {Boolean} isActive isActive status of the Team Member.
 * @apiParam {String} id id of the Admin.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Team Member activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updateTeamStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await TeamModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          isActive: isActive,
        },
      }
    );
    const text: string =
      isActive === true
        ? message.activeSuccess.replace(':item', 'Team Member')
        : message.deactivatedSuccess.replace(':item', 'Team Member');
    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: text,
      success: true,
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

/**
 ---------------------------
    DELETE TEAM MEMBER
 ---------------------------
 */

/**
 * @api {delete} team/:id     Delete Team Member
 * @apiName deleteTeamMember
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete Team Member profile
 * @apiParam {String} _id id of the Team Member.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Team Member deleted Successfully',
      success: true,
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 404 NotFound
 * {
 *    message: "Data not found.",
 *  responseCode: 404,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const deleteTeamMember = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await TeamModel.findOne({
      _id: id,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    let order: any = result.order;
    let allData: any = await TeamModel.find(
      {
        order: { $gt: order },
      },
      { _id: 1, order: 1 }
    ).lean();
    console.log('allData', allData);

    if (allData && allData.length) {
      for (const iterator of allData) {
        const updatedData: any = await TeamModel.updateOne(
          { _id: iterator._id },
          {
            $set: {
              order: iterator.order - 1,
            },
          }
        );
        console.log('updatedData', updatedData);
      }
    }

    await TeamModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );

    return res.status(200).json({
      responseCode: 200,
      message: message.deletedSuccess.replace(':item', 'Team Member'),
      success: true,
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

/**
 -------------------------------
    TEAM MEMBER BULK ACTION
 -------------------------------
 */

/**
 * @api {post} team/bulk-action      Team Member Bulk Action
 * @apiName teamBulkAction
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Perform bulk action on Team Member
 * @apiParam {String} ids id of the Team Member.
 * @apiParam {String} type type of action.
 * @apiParamExample {Object} Request-Example:
   {
  ids: ["612df7b67316b6623761c0e4",'612df7b67316b6623761c0e8],
  type:'Delete',
    }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Team Member deleted successfully",
 *   responseCode: 200,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const teamBulkAction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids, type } = req.body;
    let updateData: any = {};
    let msg = '';
    // if (type === 'Delete') {
    //   msg = 'Admin deleted successfully';
    //   updateData.isDeleted = true;
    // }
    if (type === 'Active') {
      msg = 'Admin activated successfully';
      updateData.isActive = true;
    }
    if (type === 'Deactive') {
      msg = 'Admin deactivated successfully';
      updateData.isActive = false;
    }

    await TeamModel.updateMany(
      {
        _id: {
          $in: ids.map(function (value: any) {
            return Mongoose.Types.ObjectId(value);
          }),
        },
      },
      {
        $set: updateData,
      }
    );

    return res.status(200).json({
      message: msg,
      success: true,
      responseCode: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
    });
  }
};

export {
  addTeamMember,
  getTeam,
  viewTeam,
  updateTeam,
  updateTeamStatus,
  deleteTeamMember,
  teamBulkAction,
  updateTeamByOrder,
};
