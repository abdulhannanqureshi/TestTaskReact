import { body, ValidationChain } from "express-validator";
import { FieldsMaxLengths,FieldsMinLengths,message } from "../common";
/**
 *
 */
export const AddBlogValidation: ValidationChain[] = [  
  body("category").not().isEmpty().withMessage(message.required.replace(':item','Category')).trim(),
  body("title").not().isEmpty().withMessage(message.required.replace(':item','Title')).trim(),
  body("description").not().isEmpty().withMessage(message.required.replace(':item','Description')).trim(),
];

export const EditBlogValidation: ValidationChain[] = [  
  body("category").not().isEmpty().withMessage(message.required.replace(':item','Category')).trim(),
  body("title").not().isEmpty().withMessage(message.required.replace(':item','Title')).trim(),
  body("description").not().isEmpty().withMessage(message.required.replace(':item','Description')).trim(),
];