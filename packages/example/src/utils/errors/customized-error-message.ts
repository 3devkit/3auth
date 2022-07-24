/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { BusinessErrorCode } from './business-error';

export type CustomizedErrorMessage = {
  [key in BusinessErrorCode]?: string;
};

export const CustomizedErrorMessage = {
  USER_Unauthorized: 'Customized unauthorized error message',
} as CustomizedErrorMessage;
