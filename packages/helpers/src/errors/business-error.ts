import { CustomizedErrorMessage } from './customized-error-message';

type ClientError = 'UnknownError' | 'USER_TokenNotExist';
export type BusinessErrorCode = ClientError | number;

export class BusinessError extends Error {
  private constructor(public code: BusinessErrorCode, public message: string) {
    super();
  }
  public static Of(code: BusinessErrorCode, message: string) {
    const actualMessage = CustomizedErrorMessage[code] || message;
    return new BusinessError(code, actualMessage);
  }
}
