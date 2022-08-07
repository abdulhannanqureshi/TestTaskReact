import express from 'express';

import {
  addCertificateRequest,
  viewCertificate,
  paymentForCertificate,
  viewCertificatePaymentInfo,
  createCertificate,
} from '../../controllers/frontend';
import { ValidateUserToken } from '../../common';
const CertificateRequest: express.Router = express.Router();

CertificateRequest.post('/', ValidateUserToken, addCertificateRequest);
CertificateRequest.post('/payment/:certificateId', paymentForCertificate);
CertificateRequest.get( '/create-certificate', createCertificate );
CertificateRequest.get('/:courseId', ValidateUserToken, viewCertificate);
CertificateRequest.get(
  '/payment-info/:certificateId',
  viewCertificatePaymentInfo
);

export default CertificateRequest;
