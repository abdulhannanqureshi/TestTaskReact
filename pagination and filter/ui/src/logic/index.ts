import { createLogic } from 'redux-logic';
import { push } from 'react-router-redux';
import { LoginLogics } from './Login';
import { ProfileInfoLogics } from './ProfileInfo';
import { ChangePasswordLogics } from './ChangePassword';
import { userLogics } from './User';
import { TemplateLogics } from './EmailTemplate';
import { FaqLogics } from "./Faq";
import { EnterpriseLogics } from "./Enterprise";
import { courseLogics } from './Course';
import { blogCategoryLogics } from './BlogCategory';
import { blogLogics } from './Blog';
import { moduleLogics } from './Module';
import { pressReleaseCategoryLogics } from './PressReleaseCategory';
import { pressReleaseLogics } from './PressRelease';
import { promoCodeLogics } from './PromoCode';
import { transactionLogics } from './Transaction';
import { reportLogics } from './Report';
import { dashboardLogics } from './Dashboard';
import { certificateLogics } from "./Certificate";
import { settingLogics } from "./Setting";
import { categoryLogics } from './Category';
import { universityDetailsLogics } from './UniversityDetail';
import { addCorporateLogics } from "./Corporate";
import { OurTeamLogics } from "./OurTeam";
import { SubAdminLogics } from "./SubAdminLogic";
import { FrontendTemplateLogics } from "./FrontendTemplateLogic";
import { FrontendPagesLogics } from "./FrontendPagesLogic";
import { addLabLogics } from "./Lab";

export const redirectToLogic = createLogic({
  type: "REDIRET_TO",
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(push(action.payload.path));
    done();
  },
});
// export const AllLogics: Logic[] = [
export const AllLogics: any = [
  ...LoginLogics,
  ...ProfileInfoLogics,
  ...ChangePasswordLogics,
  ...userLogics,
  ...courseLogics,
  ...FaqLogics,
  ...TemplateLogics,
  ...EnterpriseLogics,
  ...blogCategoryLogics,
  ...blogLogics,
  ...moduleLogics,
  ...pressReleaseCategoryLogics,
  ...pressReleaseLogics,
  ...promoCodeLogics,
  ...transactionLogics,
  ...reportLogics,
  ...dashboardLogics,
  ...certificateLogics,
  ...settingLogics,
  ...categoryLogics,
  ...universityDetailsLogics,
  ...addCorporateLogics,
  ...OurTeamLogics,
  ...SubAdminLogics,
  ...FrontendTemplateLogics,
  ...FrontendPagesLogics,
  ...addLabLogics,
  redirectToLogic,
];
