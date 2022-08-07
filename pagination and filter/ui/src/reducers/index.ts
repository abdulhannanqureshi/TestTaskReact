import { IRootState } from './../interfaces';
import { Reducer, AnyAction, combineReducers } from 'redux';
import { loginReducer } from './Login';
import { handleActions } from 'redux-actions';
import { profileInfoReducer } from './ProfileInfo';
import { changePasswordReducer } from './ChangePassword';
import { userReducer } from './User';
import { templateReducer } from './EmailTemplate';
import { proxyLoginReducer } from './ProxyLogin';
import { homePageReducer } from './CMS';
import { faqReducer } from "./Faq";
import { enterpriseReducer } from "./Enterprise";
import { blogCategoryReducer } from "./BlogCategory";
import { blogReducer } from "./Blog";
import { courseReducer } from './Course';
import { moduleReducer } from './Module';
import { pressReleaseCategoryReducer } from "./PressReleaseCategory";
import { pressReleaseReducer } from "./PressRelease";
import { promoCodeReducer } from "./PromoCode";
import { transactionReducer } from "./Transaction";
import { userReportReducer, saleReportReducer } from "./Report";
import { dashboardReducer } from "./Dashboard";
import { certificateReducer } from "./Certificate";
import { settingReducer } from "./Setting";
import { categoryReducer } from "./Category";
import {universityReducer} from './UniversityDetail'
import { corporateReducer } from "./Corporate";
import { ourTeamReducer } from "./OurTeam";
import { subAdminReducer } from "./SubAdminReducer";
import { FrontendTemplateReducer } from "./FrontendTemplateReducer";
import { FrontendPagesReducer } from "./FrontendPagesReducer";
import {labReducer} from './Lab'

export const mainReducer = handleActions(
  {
    SHOW_LOADER: () => ({
      showLoader: true,
    }),
    HIDE_LOADER: () => ({
      showLoader: false,
    }),
  },
  {
    showLoader: false,
  }
);

export const RootReducer: Reducer<IRootState, AnyAction> =
  combineReducers<IRootState>({
    mainReducer: mainReducer as any,
    loginReducer: loginReducer as any,
    profileInfoReducer: profileInfoReducer as any,
    changePasswordReducer: changePasswordReducer as any,
    userReducer: userReducer as any,
    TemplateReducer: templateReducer as any,
    ProxyLoginReducer: proxyLoginReducer as any,
    homePageReducer: homePageReducer as any,
    faqReducer: faqReducer as any,
    enterpriseReducer: enterpriseReducer as any,
    blogCategoryReducer: blogCategoryReducer as any,
    blogReducer: blogReducer as any,
    courseReducer: courseReducer as any,
    moduleReducer: moduleReducer as any,
    pressReleaseCategoryReducer: pressReleaseCategoryReducer as any,
    pressReleaseReducer: pressReleaseReducer as any,
    promoCodeReducer: promoCodeReducer as any,
    transactionReducer: transactionReducer as any,
    userReportReducer: userReportReducer as any,
    saleReportReducer: saleReportReducer as any,
    dashboardReducer: dashboardReducer as any,
    certificateReducer: certificateReducer as any,
    settingReducer: settingReducer as any,
    categoryReducer: categoryReducer as any,
    universityReducer: universityReducer as any,
    corporateReducer: corporateReducer as any,
    ourTeamReducer: ourTeamReducer as any,
    subAdminReducer: subAdminReducer as any,
    FrontendTemplateReducer: FrontendTemplateReducer as any,
    FrontendPagesReducer: FrontendPagesReducer as any,
    labReducer: labReducer as any,
  });
