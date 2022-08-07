import { body, ValidationChain } from "express-validator";
import { FieldsMaxLengths,FieldsMinLengths,message } from "../common";
/**
 *
 */
export const AddPromoValidation: ValidationChain[] = [  
  body("percentOff").not().isEmpty().withMessage(message.required.replace(':item','Percent Off')).trim(),
  body("promoTitle").not().isEmpty().withMessage(message.required.replace(':item',' Promo Title')).trim(),
  body("promoCode").not().isEmpty().withMessage(message.required.replace(':item','Promo Code')).trim(),
  body("endDate").not().isEmpty().withMessage(message.required.replace(':item','End Date')).trim(),
  body("startDate").not().isEmpty().withMessage(message.required.replace(':item','Start Date')).trim(),
];

export const EditPromoValidation: ValidationChain[] = [  
    body("percentOff").not().isEmpty().withMessage(message.required.replace(':item','Percent Off')).trim(),
    body("promoTitle").not().isEmpty().withMessage(message.required.replace(':item',' Promo Title')).trim(),
    body("promoCode").not().isEmpty().withMessage(message.required.replace(':item','Promo Code')).trim(),
    body("endDate").not().isEmpty().withMessage(message.required.replace(':item','End Date')).trim(),
    body("startDate").not().isEmpty().withMessage(message.required.replace(':item','Start Date')).trim(),
  ];