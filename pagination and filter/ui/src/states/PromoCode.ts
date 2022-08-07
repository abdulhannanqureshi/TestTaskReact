import { IPromoCodeModel } from "../interfaces";

export const PromoCodeInitialState: IPromoCodeModel = {
  isLoading: true,
  currentPage: 1,
  promoCodeData: [],
  promoCodeInfo:{
    courseName: '',
    courseId: '',
    promoTitle: '',
    promoCode: '',
    startDate: '',
    endDate:'',
    percentOff:'',
    isActive:false
  },
  courseData: [],
  isError: false,
  totalRecords:0,
};
