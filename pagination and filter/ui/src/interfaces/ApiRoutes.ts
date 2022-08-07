import { Method } from 'axios';

export interface IApiRoutesValues {
  service: string;
  url: string;
  method: Method;
  authenticate: boolean;
}

export interface IApiRoutes {
  ADMIN_LOGIN: IApiRoutesValues;
  ADMIN_PROFILE: IApiRoutesValues;
  ADMIN_PROFILE_UPDATE: IApiRoutesValues;
  ADMIN_CHANGE_PASSWORD: IApiRoutesValues;
  ADMIN_PROXY_LOGIN: IApiRoutesValues;
  GET_USER: IApiRoutesValues;
  ADD_USER: IApiRoutesValues;
  UPDATE_USER: IApiRoutesValues;
  DELETE_USER: IApiRoutesValues;
  VIEW_USER: IApiRoutesValues;
  UPDATE_USER_STATUS: IApiRoutesValues;
  USER_BULK_ACTION: IApiRoutesValues;
  ADD_TEMPLATE: IApiRoutesValues;
  UPDATE_TEMPLATE: IApiRoutesValues;
  GET_TEMPLATE: IApiRoutesValues;
  VIEW_TEMPLATE: IApiRoutesValues;

  EXPORT_REPORT: IApiRoutesValues;

  /** COURSE Page */
  GET_COURSE_TOPICS: IApiRoutesValues;
  ADD_COURSE: IApiRoutesValues;
  GET_COURSE: IApiRoutesValues;
  UPDATE_COURSE: IApiRoutesValues;
  VIEW_COURSE: IApiRoutesValues;
  DELETE_COURSE: IApiRoutesValues;
  UPDATE_COURSE_STATUS: IApiRoutesValues;

  /** Module */
  GET_MODULE: IApiRoutesValues;
  ADD_MODULE: IApiRoutesValues;
  UPDATE_MODULE: IApiRoutesValues;
  UPDATE_MODULE_STATUS: IApiRoutesValues;
  VIEW_MODULE: IApiRoutesValues;
  DELETE_MODULE: IApiRoutesValues;
  /**
   * CMS Page
   */

  ADD_HOME_PAGE: IApiRoutesValues;
  VIEW_HOME_PAGE: IApiRoutesValues;
  UPDATE_HOME_PAGE: IApiRoutesValues;

  // Faq
  ADD_FAQ: IApiRoutesValues;
  GET_FAQ: IApiRoutesValues;
  UPDATE_FAQ_STATUS: IApiRoutesValues;
  UPDATE_FAQ: IApiRoutesValues;
  GET_ENTERPRISE: IApiRoutesValues;
  UPDATE_BLOG_CATEGORY_STATUS: IApiRoutesValues;
  GET_BLOG_CATEGORY: IApiRoutesValues;
  ADD_BLOG_CATEGORY: IApiRoutesValues;
  UPDATE_BLOG_CATEGORY: IApiRoutesValues;
  VIEW_BLOG_CATEGORY: IApiRoutesValues;
  DELETE_BLOG_CATEGORY: IApiRoutesValues;
  GET_BLOG: IApiRoutesValues;
  ADD_BLOG: IApiRoutesValues;
  UPDATE_BLOG: IApiRoutesValues;
  VIEW_BLOG: IApiRoutesValues;
  UPDATE_BLOG_STATUS: IApiRoutesValues;
  DELETE_BLOG: IApiRoutesValues;
  UPDATE_PRESS_RELEASE_CATEGORY_STATUS: IApiRoutesValues;
  GET_PRESS_RELEASE_CATEGORY: IApiRoutesValues;
  ADD_PRESS_RELEASE_CATEGORY: IApiRoutesValues;
  UPDATE_PRESS_RELEASE_CATEGORY: IApiRoutesValues;
  VIEW_PRESS_RELEASE_CATEGORY: IApiRoutesValues;
  DELETE_PRESS_RELEASE_CATEGORY: IApiRoutesValues;
  GET_PRESS_RELEASE: IApiRoutesValues;
  ADD_PRESS_RELEASE: IApiRoutesValues;
  UPDATE_PRESS_RELEASE: IApiRoutesValues;
  VIEW_PRESS_RELEASE: IApiRoutesValues;
  UPDATE_PRESS_RELEASE_STATUS: IApiRoutesValues;
  DELETE_PRESS_RELEASE: IApiRoutesValues;
  GET_PROMO_CODE: IApiRoutesValues;
  ADD_PROMO_CODE: IApiRoutesValues;
  UPDATE_PROMO_CODE: IApiRoutesValues;
  VIEW_PROMO_CODE: IApiRoutesValues;
  UPDATE_PROMO_CODE_STATUS: IApiRoutesValues;
  DELETE_PROMO_CODE: IApiRoutesValues;
  GET_TRANSACTION: IApiRoutesValues;
  GET_USER_REPORT: IApiRoutesValues;
  GET_SALE_REPORT: IApiRoutesValues;
  GET_DASHBOARD: IApiRoutesValues;
  GET_UNIVERSITY: IApiRoutesValues;
  GET_CORPORATION: IApiRoutesValues;
  GET_CERTIFICATE: IApiRoutesValues;
  UPDATE_CERTIFICATE_STATUS: IApiRoutesValues;
  VIEW_SETTING: IApiRoutesValues;
  UPDATE_SETTING: IApiRoutesValues;
  GET_CATEGORY: IApiRoutesValues;
  ADD_CATEGORY: IApiRoutesValues;
  UPDATE_CATEGORY: IApiRoutesValues;
  UPDATE_CATEGORY_STATUS: IApiRoutesValues;
  VIEW_CATEGORY: IApiRoutesValues;
  DELETE_CATEGORY: IApiRoutesValues;
  CATEGORY_BULK_ACTION: IApiRoutesValues;
  BLOG_BULK_ACTION: IApiRoutesValues;
  PRESS_RELEASE_BULK_ACTION: IApiRoutesValues;
  PROMOCODE_BULK_ACTION: IApiRoutesValues;
  COURSE_BULK_ACTION: IApiRoutesValues;
  MODULE_BULK_ACTION: IApiRoutesValues;
  GET_TRANSATION_REPORTS: IApiRoutesValues;
  GET_USER_REPORTS: IApiRoutesValues;
  TALENT_LMS_API: IApiRoutesValues;
  ADD_UNIVERSITY_NAME: IApiRoutesValues;
  GET_UNIVERSITY_NAME: IApiRoutesValues;
  GET_CORPORATE: IApiRoutesValues;
  ADD_CORPORATE: IApiRoutesValues;
  EDIT_UNIVERSITY: IApiRoutesValues;
  DELETE_UNIVERSITY: IApiRoutesValues;
  UPDATE_UNIVERSITY_STATUS: IApiRoutesValues;
  VIEW_UNIVERSITY: IApiRoutesValues;
  UPDATE_CORPORATE_STATUS: IApiRoutesValues;
  DELETE_CORPORATE: IApiRoutesValues;
  VIEW_CORPORATE: IApiRoutesValues;
  EDIT_CORPORATE: IApiRoutesValues;
  GET_SUB_ADMIN: IApiRoutesValues;
  Add_SUB_ADMIN: IApiRoutesValues;
  VIEW_SUB_ADMIN: IApiRoutesValues;
  EDIT_SUB_ADMIN: IApiRoutesValues;
  DELETE_SUB_ADMIN: IApiRoutesValues;
  STATUS_SUB_ADMIN: IApiRoutesValues;
  REPORT_SUB_ADMIN: IApiRoutesValues;
  BULK_SUB_ADMIN: IApiRoutesValues;
  GET_FRONTEND_TEMPLATE: IApiRoutesValues;
  VIEW_FRONTEND_TEMPLATE: IApiRoutesValues;
  EDIT_FRONTEND_TEMPLATE: IApiRoutesValues;
  ADD_OUR_TEAM: IApiRoutesValues;
  GET_OUR_TEAM: IApiRoutesValues;
  VIEW_OUR_TEAM: IApiRoutesValues;
  EDIT_OUR_TEAM: IApiRoutesValues;
  ORDER_OUR_TEAM:IApiRoutesValues;
  DELETE_OUR_TEAM: IApiRoutesValues;
  STATUS_OUR_TEAM: IApiRoutesValues;
  BULK_OUR_TEAM: IApiRoutesValues;
  GET_FRONTEND_PAGES: IApiRoutesValues;
  VIEW_FRONTEND_PAGES: IApiRoutesValues;
  EDIT_FRONTEND_PAGES: IApiRoutesValues;
  ADD_LAB:IApiRoutesValues;
  GET_LAB:IApiRoutesValues;
  STATUS_LAB:IApiRoutesValues;
  DELETE_LAB:IApiRoutesValues;
  VIEW_LAB:IApiRoutesValues;
  EDIT_LAB:IApiRoutesValues;
  BULK_LAB:IApiRoutesValues

}

