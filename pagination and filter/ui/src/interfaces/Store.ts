import { ILoginModal } from './Login';
import { IChangePasswordModal, IProfileModal } from './Profile';
import { IUserModel } from './User';
import { ITemplateModal } from './EmailTemplate';
import { IFaqModel } from './FAQ';
import { IEnterpriseModel } from './Enterprise';
import { IBlogCategoryModel } from './BlogCategory';
import { IBlogModel } from './Blog';
import { ICourseModel } from './Course'
import { IModuleModel } from './Module'
import { IPressReleaseCategoryModel } from './PressReleaseCategory';
import { IPressReleaseModel } from './PressRelease';
import { IPromoCodeModel } from './PromoCode';
import { ITransactionModel } from './Transaction';
import { IUserReportModel, ISaleReportModel } from './Report';
import { IDashboardModel } from './Dashboard';
import { ICertificateModel } from './Certificate';
import { ISettingModel } from './Setting';
import { ICategoryModel } from './Category';
import { IUniversityListingModel } from './UniverityDetail';
import { ICorporateModel } from "./Corporate";
import { IOurTeamModel } from "./OurTeam";
import { ISubAdminModel } from "./SubAdminInterface";
import { IFrontendTemplateModel } from "./FrontendTemplateInterface";
import { ILabModel } from '.';

export interface ImainState {
  showLoader: boolean;
}

export interface IRootState {
  loginReducer: ILoginModal;
  profileInfoReducer: IProfileModal;
  mainReducer: ImainState;
  changePasswordReducer: IChangePasswordModal;
  userReducer: IUserModel;
  TemplateReducer: ITemplateModal;
  ProxyLoginReducer: ILoginModal;
  homePageReducer: ILoginModal;
  faqReducer: IFaqModel;
  enterpriseReducer: IEnterpriseModel;
  blogCategoryReducer: IBlogCategoryModel;
  blogReducer: IBlogModel;
  courseReducer: ICourseModel;
  moduleReducer: IModuleModel;
  pressReleaseCategoryReducer: IPressReleaseCategoryModel;
  pressReleaseReducer: IPressReleaseModel;
  promoCodeReducer: IPromoCodeModel;
  transactionReducer: ITransactionModel;
  userReportReducer: IUserReportModel;
  saleReportReducer: ISaleReportModel;
  dashboardReducer: IDashboardModel;
  certificateReducer: ICertificateModel;
  settingReducer: ISettingModel;
  categoryReducer: ICategoryModel;
  universityReducer: IUniversityListingModel;
  corporateReducer: ICorporateModel;
  ourTeamReducer: IOurTeamModel;
  subAdminReducer: ISubAdminModel;
  FrontendTemplateReducer: IFrontendTemplateModel;
  FrontendPagesReducer: IFrontendTemplateModel;
  labReducer:ILabModel
}
