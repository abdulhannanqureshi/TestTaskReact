import { body, ValidationChain } from "express-validator";
import { FieldsMaxLengths,FieldsMinLengths,message } from "../common";

/**
 *
 */
export const AddBlogCategoryValidation: ValidationChain[] = [  
  body("categoryName").not().isEmpty().withMessage(message.required.replace(':item','Category Name')).trim(),
];

export const EditBlogCategoryValidation: ValidationChain[] = [  
  body("categoryName").not().isEmpty().withMessage(message.required.replace(':item','Category Name')).trim(),
];