declare namespace Express {
  export interface Request {
    currentUser?: {
      id: string;
      _id: any;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
  }
}

declare module "node-excel-export";
declare module "swagger-ui-express";