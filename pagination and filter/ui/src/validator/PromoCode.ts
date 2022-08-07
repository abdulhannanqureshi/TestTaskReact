import Validator from 'js-object-validation';
// import ValidationTypes from "js-object-validation";
import { message } from '../app/common';

export const promoCodeValidator = (data: any) => {
  const validations = {
    promoTitle: {
      required: true,
      minlength:3,
      maxlength:30
    },
    promoCode: {
      required: true,
      minlength:5,
      maxlength:10
    },
    startDate: {
      required: true,
    },
    endDate: {
      required: true,
    },
    percentOff: {
      required: true,
    },
  };
  // Error messages
  const messages = {
    courseId: {
      required: message.Required.replace(":item", "Course"),
    },
    promoTitle: {
      required: message.Required.replace(":item", "Promo title"),
      minlength: message.MinLengthPromo.replace(":item","Promo title"),
      maxlength: message.MaxLengthPromo.replace(":item","Promo title")
    },
    promoCode: {
      required: message.Required.replace(":item", "Promo code"),
      minlength: message.MinLengthPromoCode.replace(":item","Promo code"),
      maxlength: message.MaxLengthPromoCode.replace(":item","Promo code")
    },
    startDate: {
      required: message.Required.replace(":item", "Start date"),
    },
    endDate: {
      required: message.Required.replace(":item", "End date"),
    },
    percentOff: {
      required: message.Required.replace(":item", "Percent off"),
    },
  };

  const { isValid, errors } = Validator(data, validations, messages);
  return {
    isValid,
    errors,
  };
};
