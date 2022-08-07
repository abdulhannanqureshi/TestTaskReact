import { Request, Response } from 'express';
import * as fastCsv from 'fast-csv';
import fs from 'fs';
import path from 'path';

import { TeamModel, EmailTemplateModel } from '../../models';
import { message, Email } from '../../common';
import { Document, Types } from 'mongoose';
import moment from 'moment';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';

import Mongoose from 'mongoose';

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
    let sort: any = { order: 1 };
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
    })
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

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

export { getTeam, viewTeam };
