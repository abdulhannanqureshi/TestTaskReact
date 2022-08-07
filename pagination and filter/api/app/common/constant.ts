const FieldsMaxLengths: any = {
  firstName: 20,
  middleName: 20,
  password: 16,
};

const FieldsMinLengths: any = {
  firstName: 3,
  lastName: 3,
  password: 6,
};

const rolesPermission = [
  'Dashboard',
  'Labs',
  'Our Team',
  'ourTeamEdit',
  'CourseEdit',
  'CustomerView',
  'CustomerEdit',
  'CertificateView',
  'PromoCodesView',
  'CertificateEdit',
  'CourseView',
  'UserEdit',
  'PromoCodesEdit',
  'BlogEdit',
  'UserView',
  'PressReleaseView',
  'TransactionView',
  'TransactionEdit',
  'EmailTemplatesView',
  'PressReleaseEdit',
  'UniversityView',
  'UniversityEdit',
  'CorporateView',
  'CorporateEdit',
  'EmailTemplatesEdit',
  'Sub Admin',
  'SubAdminEdit',
  'SettingsView',
  'SettingsEdit',
  'BlogView',
  'CMS Management',
  'CmsEdit',
  'labEdit',
];

export { FieldsMinLengths, FieldsMaxLengths, rolesPermission };
