export const ENVEnum: any = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};


export const Environment: string = process.env.NODE_ENV || ENVEnum.DEVELOPMENT;
export const API_ENDPOINT: any =
  Environment === ENVEnum.DEVELOPMENT
    ? process.env.REACT_APP_API_ENDPOINT
    : 'http://api.drpolly.com/v1';

export const ImageURL: any =
  Environment === ENVEnum.DEVELOPMENT
    ? process.env.REACT_APP_IMAGE_URL
    : 'http://images.drpolly.com';