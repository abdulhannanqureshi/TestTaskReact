import express from 'express';
import {
  getList,
  updateCertificateStatus,
  checkExpiredPaymentLink,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const CertificateRequestRouter: express.Router = express.Router();

CertificateRequestRouter.get('/', getList);
CertificateRequestRouter.get(
  '/checkExpiredPaymentLink',
  checkExpiredPaymentLink
);
CertificateRequestRouter.put('/update-status/:id', updateCertificateStatus);

export default CertificateRequestRouter;
