const nodemailer = require('nodemailer');
import { Document } from 'mongoose';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import { validate } from 'deep-email-validator';

let transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const checkEmail: any = async function isEmailValid(email: any) {
  return validate({
    email,
    validateTypo: true,
    validateDisposable: true,
    validateRegex: true,
    validateMx: true,
    validateSMTP: false,
  });
};
class Email {
  cc: any;
  subject: any;
  to: any;
  host: any;
  body: any;
  webURL: any;
  adminURL: any;
  constructor(req: Request) {
    this.body = '';
    this.subject = '';
    this.to = [];
    this.cc = '';
    const host =
      req && req.headers && req.headers.referer
        ? req.headers.referer.split('/')
        : [];
    this.host = [host[0] || '', host[1] || '', host[2] || ''].join('/');
    this.webURL = '';
    this.adminURL = '';
  }

  async setTemplate(
    subject: string,
    content: any,
    replaceObject: any
  ): Promise<any> {
    // if (!templateName) {
    //   throw new Error('Please provide template name');
    // }
    const header: any = fs.readFileSync(
      path.join(__dirname, '..', 'app/emailtemplates', 'Header.html'),
      'utf8'
    );

    const footer: any = fs.readFileSync(
      path.join(__dirname, '..', 'app/emailtemplates', 'Footer.html'),
      'utf8'
    );

    this.subject = subject;
    // To replace variables dynamically
    for (const key in replaceObject) {
      if (replaceObject.hasOwnProperty(key)) {
        const val = replaceObject[key];
        content = content.replace(new RegExp(`{${key}}`, 'g'), val);
      }
    }
    content = `${header}${content}${footer}`;

    this.body = content;

    return content;
  }

  setSubject(subject: string) {
    this.subject = subject;
  }
  setBody(body: Document) {
    this.body = body;
  }
  setCC(cc: string) {
    this.cc = cc;
  }
  async sendEmail(email: string): Promise<any> {
    if (!email) {
      throw new Error('Please provide email.');
    }
    const mailOption = {
      from: 'Coinifide <no-reply@coinified.com>',
      to: email,
      cc: this.cc,
      subject: this.subject,
      html: this.body,
    };
    let resp = transporter.sendMail(mailOption);
    return resp;
  }
}

export { Email, checkEmail };
