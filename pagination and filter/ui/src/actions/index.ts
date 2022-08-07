import { createAction } from 'redux-actions';

export * from './Login';
export * from './ProfileInfo';
export * from './ChangePassword';
export * from './User';
export * from './EmailTemplate';
export * from './Report';
export * from './ProxyLogin';
export * from './CMS';
export * from './Faq';
export * from './Enterprise';
export * from './BlogCategory';
export * from './Blog';
export * from './Course';
export * from './Module';
export * from './PressReleaseCategory';
export * from './PressRelease';
export * from './PromoCode';
export * from './Transaction';
export * from './Dashboard';
export * from './Certificate';
export * from './Setting';
export * from './Category';
export * from './UniversityDetail';
export * from "./Corporate";
export * from "./OurTeam";
export * from "./SubAdmin";
export * from "./FrontendTemplateAction";
export * from "./FrontendPagesAction";
export * from "./Labs";


//
export const redirectTo = createAction('REDIRET_TO');
//
export const showLoader = createAction('SHOW_LOADER');
export const hideLoader = createAction('HIDE_LOADER');
