import { Request, Response } from 'express';
const TalentLMS = require('talentlms');
import {
  UserModel,
  EmailTemplateModel,
  UniversityModel,
  CorporateModel,
  CourseTopicModel,
  CourseModel,
  ModuleModel,
} from '../../models';
import {
  encryptPassword,
  generateSalt,
  message,
  generatePassword,
} from '../../common';
import { Document, Types } from 'mongoose';
import moment from 'moment';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { Email } from '../../common';
/**
 ---------------------------
    ADD TALENT LMS USERS
 ---------------------------
 */

/**
 * @api {get} talentLms/add-users  Add talent lms users
 * @apiName addTlmsUsers
 * @apiGroup SuperAdmin
 * @apiPermission Admin
 * @apiDescription To Add talent lms users
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"users added successfully",
 *    responseCode: 200
 *    data: result
 *    success: true
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 404 NotFound
 
 *    HTTP/1.1 500 Internal Server Error
 */

const addTlmsUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    // const sort: any = { createdAt: -1 };
    const talentLMS = new TalentLMS(
      process.env.TALENTLMSURL,
      process.env.TALENTLMSAPIKEY
    );
    const users: Document[] | any = await talentLMS.Users.getUsers();
    let arr: any = [];
    if (users && users.length) {
      for (const iterator of users) {
        if (iterator.user_type === 'SuperAdmin') {
          continue;
        }
        const emailCheck: Document | any = await UserModel.findOne({
          email: iterator.email,
        });

        if (emailCheck) {
          if (
            emailCheck.talentLmsUserId === '' ||
            emailCheck.talentLmsUserId.length <= 0
          ) {
            await UserModel.updateOne(
              {
                _id: emailCheck._id,
              },
              {
                $set: {
                  talentLmsUserId: iterator.id,
                },
              }
            );
            continue;
          } else {
            continue;
          }
        }
        let role: String = '';

        switch (iterator.user_type) {
          case 'Learner-Type':
            role = 'Individual';
            break;
          case 'Trainer-Type':
            role = 'Student';
            break;
          case 'Admin-Type':
            role = 'Corporate Employee';
            break;

          default:
            break;
        }
        let password: string;
        password = generatePassword(8);

        const salt: string = generateSalt(10);
        const encryptedPassword: string = encryptPassword(password, salt);

        let obj: Object = {
          firstName: iterator.first_name,
          lastName: iterator.last_name,
          email: iterator.email,
          talentLmsUserId: iterator.id,
          role,
          password: encryptedPassword,
        };
        await arr.push({ ...obj });
      }
    } //end of if

    if (arr.length && arr.length > 0) {
      await UserModel.insertMany(arr);
    }
    return res.status(200).json({
      message:
        arr && arr.length > 0
          ? message.addedSuccess.replace(':item', 'Users')
          : 'No Users Added',
      success: true,
      responseCode: 200,
      data: arr,
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
/**
 ---------------------------
   ADD TALENT LMS CATEGORY
 ---------------------------
 */

/**
 * @api {get} talentLms/add-category  Add talent lms category By Seeder
 * @apiName addTlmsCategories
 * @apiGroup SuperAdmin
 * @apiPermission Admin
 * @apiDescription To Add talent lms Category By Seeder
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Category added successfully",
 *    responseCode: 200
 *    data: result
 *    success: true
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 404 NotFound
 
 *    HTTP/1.1 500 Internal Server Error
 */
const addTlmsCategories = async (): Promise<any> => {
  try {
    // const sort: any = { createdAt: -1 };
    const talentLMS = new TalentLMS(
      process.env.TALENTLMSURL,
      process.env.TALENTLMSAPIKEY
    );

    // const courses: Document[] | any = await talentLMS.Courses.getCourses();
    const Categories: Document[] | any =
      await talentLMS.Categories.getCategories();
    let arr: any = [];

    if (Categories && Categories.length) {
      for (const iterator of Categories) {
        if (iterator.parent_category_id === null) {
          const nameCheck: Document | any = await CourseTopicModel.findOne({
            topicName: iterator.name,
          });

          if (nameCheck) {
            if (
              nameCheck.talentLmsCategoryId === '' ||
              nameCheck.talentLmsCategoryId.length <= 0
            ) {
              await CourseTopicModel.updateOne(
                {
                  _id: nameCheck._id,
                },
                {
                  $set: {
                    talentLmsCategoryId: iterator.id,
                  },
                }
              );
              continue;
            } else {
              continue;
            }
          }

          let obj: Object = {
            topicName: iterator.name,
            talentLmsCategoryId: iterator.id,
          };
          await arr.push({ ...obj });
        }
      }
    } //end of if
    if (arr.length && arr.length > 0) {
      await CourseTopicModel.insertMany(arr);
    }
    return {
      message:
        arr && arr.length > 0
          ? message.addedSuccess.replace(':item', 'Categories')
          : 'No Categories Added',
      success: true,
      responseCode: 200,
      data: arr,
    };
    /* return res.status(200).json({
      message:
        arr && arr.length > 0
          ? message.addedSuccess.replace(':item', 'Categories')
          : 'No Categories Added',
      success: true,
      responseCode: 200,
      data: arr,
    }); */
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
    };
    /* res.status(500).json({
      success: false,
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
    }); */
  }
};
/**
 -----------------------------------------
     ADD TALENT LMS CATEGORY BY ADMIN
 -----------------------------------------
 */

/**
 * @api {get} talentLms/add-category  Add talent lms category By Admin
 * @apiName addTlmsCategoriesApi
 * @apiGroup SuperAdmin
 * @apiPermission Admin
 * @apiDescription To Add talent lms Category By Admin
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Category added successfully",
 *    responseCode: 200
 *    data: result
 *    success: true
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 404 NotFound
 
 *    HTTP/1.1 500 Internal Server Error
 */
// const addTlmsCategoriesApi = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     // const sort: any = { createdAt: -1 };
//     const talentLMS = new TalentLMS(
//       process.env.TALENTLMSURL,
//       process.env.TALENTLMSAPIKEY
//     );

//     // const courses: Document[] | any = await talentLMS.Courses.getCourses();
//     const Categories: Document[] | any =
//       await talentLMS.Categories.getCategories();
//     let arr: any = [];

//     if (Categories && Categories.length) {
//       for (const iterator of Categories) {
//         if (iterator.parent_category_id === null) {
//           const nameCheck: Document | any = await CourseTopicModel.findOne({
//             topicName: iterator.name,
//           });

//           if (nameCheck) {
//             if (
//               nameCheck.talentLmsCategoryId === '' ||
//               nameCheck.talentLmsCategoryId.length <= 0
//             ) {
//               await CourseTopicModel.updateOne(
//                 {
//                   _id: nameCheck._id,
//                 },
//                 {
//                   $set: {
//                     talentLmsCategoryId: iterator.id,
//                   },
//                 }
//               );
//               continue;
//             } else {
//               continue;
//             }
//           }

//           let obj: Object = {
//             topicName: iterator.name,
//             talentLmsCategoryId: iterator.id,
//           };
//           await arr.push({ ...obj });
//         }
//       }
//     } //end of if
//     if (arr.length && arr.length > 0) {
//       await CourseTopicModel.insertMany(arr);
//     }
//     // return {
//     //   message:
//     //     arr && arr.length > 0
//     //       ? message.addedSuccess.replace(':item', 'Categories')
//     //       : 'No Categories Added',
//     //   success: true,
//     //   responseCode: 200,
//     //   data: arr,
//     // };
//     return res.status(200).json({
//       message:
//         arr && arr.length > 0
//           ? message.addedSuccess.replace(':item', 'Categories')
//           : 'No New Categories Added',
//       success: true,
//       responseCode: 200,
//       data: arr,
//     });
//   } catch (error) {
//     // return {
//     //   success: false,
//     //   message:
//     //     error instanceof Error && error.message
//     //       ? error.message
//     //       : message.unexpectedError,
//     // };
//     res.status(500).json({
//       success: false,
//       message:
//         error instanceof Error && error.message
//           ? error.message
//           : message.unexpectedError,
//     });
//   }
// };
/**
 ---------------------------
    ADD TALENT LMS COURSES
 ---------------------------
 */

/**
 * @api {get} talentLms/add-course  Add talent lms course
 * @apiName addTlmsCourses
 * @apiGroup SuperAdmin
 * @apiPermission Admin
 * @apiDescription To Add talent lms Course
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Courses added successfully",
 *    responseCode: 200,
 *    success: true,
      courses,
      courseArray,
      moduleArray,
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 404 NotFound
 
 *    HTTP/1.1 500 Internal Server Error
 */
const addTlmsCourses = async (req: Request, res: Response): Promise<any> => {
  try {
    const talentLMS = new TalentLMS(
      process.env.TALENTLMSURL,
      process.env.TALENTLMSAPIKEY
    );
    const Categories: Document[] | any =
      await talentLMS.Categories.getCategories();
    const courses: Document[] | any = await talentLMS.Courses.getCourses();
    let courseArray = [];
    let courseNotIncluded = [];
    // let emptyCode = [];
    let moduleArray = [];
    let talentlmsIds = [];
    for (let x in courses) {
      talentlmsIds.push(courses[x].id.toString());

      let code = courses[x].code;
      let hyphen = code.includes('-');
      // if (code === '') {
      //   emptyCode.push(code);
      // }
      if (!hyphen) {
        courseNotIncluded.push(code);
      }

      let codeArray = code.split('-'); //cba01-Bc

      // if (codeArray.length === 2) {
      //   moduleArray.push(courses[x]);
      // } else {
      //   courseArray.push(courses[x]);
      // }
      if (codeArray[1] != undefined) {
        if (codeArray[1].length === 1) {
          courseArray.push(courses[x]);
        } else {
          moduleArray.push(courses[x]);
        }
      }
    }

    for (let x in courseArray) {
      const topic: Document[] | any = await CourseTopicModel.findOne({
        talentLmsCategoryId: courseArray[x].category_id,
      });
      if (topic) {
        const checkCourse: Document | any = await CourseModel.findOne({
          talentLmsCourseId: courseArray[x].id,
          // code: courseArray[x].code,
        });

        const insertCourse = {
          title: courseArray[x].name,
          code: courseArray[x].code,
          description: courseArray[x].description,
          // price: courseArray[x].price.split(";")[1],
          price: courseArray[x].custom_field_1,
          topic: topic._id,
          talentLmsCourseId: courseArray[x].id,
        };
        if (checkCourse) {
          await CourseModel.updateOne(
            {
              talentLmsCourseId: courseArray[x].id,
            },
            {
              $set: insertCourse,
            }
          );
        } else {
          await CourseModel.create(insertCourse);
        }
      }
    }
    for (let x in moduleArray) {
      let str = moduleArray[x].code;
      str = str.substring(0, str.length - 1);
      const course: Document[] | any = await CourseModel.findOne({
        // code: moduleArray[x].code.split('-')[0],
        code: str,
      });

      if (course) {
        const checkModule: Document | any = await ModuleModel.findOne({
          talentLmsCourseId: moduleArray[x].id,
          // code: moduleArray[x].code,
        });

        const insertModule = {
          moduleName: moduleArray[x].name,
          code: moduleArray[x].code,
          description: moduleArray[x].description,
          // price: moduleArray[x].price.split(";")[1],
          amount: moduleArray[x].custom_field_1,
          // amount: 300,
          course: course._id,
          talentLmsCourseId: moduleArray[x].id,
        };
        if (checkModule) {
          await ModuleModel.updateOne(
            {
              talentLmsCourseId: moduleArray[x].id,
            },
            {
              $set: insertModule,
            }
          );
        } else {
          await ModuleModel.create(insertModule);
        }
      }
    }
    if (talentlmsIds && talentlmsIds.length > 0) {
      const courseDelete: any = await CourseModel.deleteMany(
        {
          talentLmsCourseId: { $nin: talentlmsIds },
        }
        // {
        //   $set: {
        //     isDeleted: true,
        //   },
        // }
      ).lean();
      console.log('courseDelete', courseDelete);

      const moduleDelete: any = await ModuleModel.deleteMany(
        {
          talentLmsCourseId: { $nin: talentlmsIds },
          // code: courseArray[x].code,
        }
        // {
        //   $set: {
        //     isDeleted: true,
        //   },
        // }
      ).lean();
      // const moduleDelete: any = await ModuleModel.updateMany(
      //   {
      //     talentLmsCourseId: { $nin: talentlmsIds },
      //     // code: courseArray[x].code,
      //   },
      //   {
      //     $set: {
      //       isDeleted: true,
      //     },
      //   }
      // );
      console.log('moduleDelete', moduleDelete);
    }
    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'Courses'),
      success: true,
      responseCode: 200,
      courseNotIncluded,
      Categories,
      courses,
      courseArray,
      moduleArray,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
    });
  }
};
// const addTlmsCourses = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const talentLMS = new TalentLMS(
//       process.env.TALENTLMSURL,
//       process.env.TALENTLMSAPIKEY
//     );

//     const courses: Document[] | any = await talentLMS.Courses.getCourses();
//     let courseArray = [];
//     let courseNotIncluded = [];
//     // let emptyCode = [];
//     let moduleArray = [];
//     for (let x in courses) {
//       let code = courses[x].code;
//       let hyphen = code.includes('-');
//       // if (code === '') {
//       //   emptyCode.push(code);
//       // }
//       if (!hyphen) {
//         courseNotIncluded.push(code);
//       }

//       let codeArray = code.split('-'); //cba01-Bc

//       // if (codeArray.length === 2) {
//       //   moduleArray.push(courses[x]);
//       // } else {
//       //   courseArray.push(courses[x]);
//       // }
//       if (codeArray[1] != undefined) {
//         if (codeArray[1].length === 1) {
//           courseArray.push(courses[x]);
//         } else {
//           moduleArray.push(courses[x]);
//         }
//       }
//     }

//     for (let x in courseArray) {
//       const topic: Document[] | any = await CourseTopicModel.findOne({
//         talentLmsCategoryId: courseArray[x].category_id,
//       });
//       if (topic) {
//         const checkCourse: Document | any = await CourseModel.findOne({
//           talentLmsCourseId: courseArray[x].id,
//         });
//         const insertCourse = {
//           title: courseArray[x].name,
//           code: courseArray[x].code,
//           description: courseArray[x].description,
//           // price: courseArray[x].price.split(";")[1],
//           price: courseArray[x].custom_field_1,
//           topic: topic._id,
//           talentLmsCourseId: courseArray[x].id,
//         };
//         if (checkCourse) {
//           await CourseModel.updateOne(
//             {
//               talentLmsCourseId: courseArray[x].id,
//             },
//             {
//               $set: insertCourse,
//             }
//           );
//         } else {
//           await CourseModel.create(insertCourse);
//         }
//       }
//     }
//     for (let x in moduleArray) {
//       let str = moduleArray[x].code;
//       str = str.substring(0, str.length - 1);
//       const course: Document[] | any = await CourseModel.findOne({
//         // code: moduleArray[x].code.split('-')[0],
//         code: str,
//       });

//       if (course) {
//         const checkModule: Document | any = await ModuleModel.findOne({
//           talentLmsCourseId: moduleArray[x].id,
//         });
//         const insertModule = {
//           moduleName: moduleArray[x].name,
//           code: moduleArray[x].code,
//           description: moduleArray[x].description,
//           // price: moduleArray[x].price.split(";")[1],
//           // amount: moduleArray[x].custom_field_1,
//           amount: 300,
//           course: course._id,
//           talentLmsCourseId: moduleArray[x].id,
//         };
//         if (checkModule) {
//           await ModuleModel.updateOne(
//             {
//               talentLmsCourseId: moduleArray[x].id,
//             },
//             {
//               $set: insertModule,
//             }
//           );
//         } else {
//           await ModuleModel.create(insertModule);
//         }
//       }
//     }
//     return res.status(200).json({
//       message: message.addedSuccess.replace(':item', 'Courses'),
//       success: true,
//       responseCode: 200,
//       courseNotIncluded,
//       courses,
//       courseArray,
//       moduleArray,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message:
//         error instanceof Error && error.message
//           ? error.message
//           : message.unexpectedError,
//     });
//   }
// };

export {
  addTlmsUsers,
  // addTlmsCategoriesApi,
  addTlmsCategories,
  addTlmsCourses,
};
