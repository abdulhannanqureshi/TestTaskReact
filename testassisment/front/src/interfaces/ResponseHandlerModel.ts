// For Common
export interface IResponseHandlerModel {
  code: Number;
  isError: boolean;
  timestamp: any;
  error?: string;
  messages: any;
  data?: any;
}
