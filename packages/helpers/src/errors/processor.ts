import { BusinessError } from './business-error';

interface NeedCheckObject {
  [key: string]: NeedCheckObject;
}
interface MessageObject {
  CODE: number;
  MESSAGE: string;
}
function getHumanCode(
  code: number,
  prekey: string,
  needCheckObject: NeedCheckObject | MessageObject,
):
  | {
      humanCode: string;
      message: string;
    }
  | undefined {
  if (needCheckObject.CODE) {
    if (needCheckObject.CODE === code) {
      return { humanCode: prekey, message: needCheckObject.MESSAGE as string };
    } else {
      return;
    }
  }

  return Object.keys(needCheckObject)
    .map(k => getHumanCode(code, k, (needCheckObject as NeedCheckObject)[k]))
    .find(c => c);
}

export function processRequestError(error: { response?: { status: number; data?: { statusCode: number } } }) {
  if (!error.response?.status) {
    console.error(error, '==error-1');
    return BusinessError.Of('UnknownError', 'Network error');
  }
  if (!error.response?.data?.statusCode) {
    console.error(error, '==error-2');
    throw new Error('not handle error, need fix');
  }

  const { humanCode: code, message } = getHumanCode(error.response?.data?.statusCode, '', {}) || {
    humanCode: 'UnknownError',
    message: 'UnknownError',
  };
  if (code === 'UnknownError') {
    console.warn('UnknownError when request, ', error);
  }
  return BusinessError.Of(code as any, message);
}
