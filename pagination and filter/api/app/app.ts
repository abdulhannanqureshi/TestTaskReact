import express from 'express';
import cors from 'cors';
//var CronJob = require('cron').CronJob;
import cron from 'node-cron';
// import * as bodyParser from "body-parser";
import routerSuperadmin from './routes/superadmin';
import routerFrontend from './routes/frontend';
import { connect } from 'mongoose';
import path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';
import { checkExpiredPaymentLink } from '../app/controllers/superadmin/certificateRequest';
import { removeUserFromTlmsCourse } from '../app/controllers/superadmin/transaction';
import {
  SuperAdminSeeder,
  CourseTopicSeeder,
  EmailTemplateTemplateSeeder,
  UniversitySeeder,
  CorporateSeeder,
  SettingSeeder,
  PrivacyPolicySeeder,
  TermsAndConditionSeeder,
  RefundPolicySeeder,
  DoNotSellSeeder,
  CmsSeeder,
  MarketingSeeder,
} from './seeders';

// Create a new express application instance
const app: express.Application = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connect(`${process.env.DB_URI}`, {
  useNewUrlParser: true,
})
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Database connected successfully.');

    // To add default Data in DB, if it's doesn't exits already
    SuperAdminSeeder.addSuperAdmin();
    CourseTopicSeeder.addCourseTopic();
    EmailTemplateTemplateSeeder.addRegistrationTemplate();
    EmailTemplateTemplateSeeder.forgetPasswordTemplate();
    EmailTemplateTemplateSeeder.paymentSuccessTemplate();
    EmailTemplateTemplateSeeder.paymentLinkTemplate();
    EmailTemplateTemplateSeeder.addEnquiryTemplate();
    EmailTemplateTemplateSeeder.addUserEnquiryMailTemplate();
    EmailTemplateTemplateSeeder.addEmailChangesMailTemplate();
    UniversitySeeder.addUniversities();
    CorporateSeeder.addCorporate();
    SettingSeeder.addSetting();
    PrivacyPolicySeeder.addPrivacyPolicy();
    TermsAndConditionSeeder.addTermsAndCondition();
    RefundPolicySeeder.addRefundPolicy();
    DoNotSellSeeder.addDoNotSell();
    CmsSeeder.addRefundPolicy();
    //  CmsSeeder.addCertificateWebPage();
    CmsSeeder.addDoNotSell();
    CmsSeeder.addPrivacyPolicy();
    CmsSeeder.addTermsAndCondition();
    MarketingSeeder.addEnterpriseWebPage();
    MarketingSeeder.addLabsWebPage();
    MarketingSeeder.addMarketWebPage();
    MarketingSeeder.addAboutUsPage();
    MarketingSeeder.addCertificateWebPage();
    MarketingSeeder.addUniversityPage();
    MarketingSeeder.addhomePage();
    MarketingSeeder.addCourseWebPage();
    MarketingSeeder.addFooterWebPage();
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log('Error in database connection', err.message);
  });

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());
// console.log(path.join(__dirname, '..', 'app/public'));

const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token', 'authorization'],
};
app.use(cors(corsOption));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..', 'app/public')));
// path for API
app.use('/api/v1.0.0', routerSuperadmin);
app.use('/api/v1.0.1', routerFrontend);

// Static Path of build
// app.use(express.static(path.join(__dirname, 'admin')));
// app.use('/admin', express.static(path.join(__dirname, '..', 'admin'))); // serving admin end build

// Admin panel build
/* app.get(['/', '/*'], ({ headers }, res) => {
  console.log(headers.host, 'headers.host');
  return res.sendFile(
    path.join(__dirname, '..', 'admin', 'index.html')
  );
}); */

cron.schedule('0 * * * *', () => {
  // console.log('running a task every minute');
  checkExpiredPaymentLink();
  removeUserFromTlmsCourse();
});

// route for home page
app.get('**', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
