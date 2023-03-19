export interface ResponseErrorType {
  location: string;
  msg: string;
  param: string;
}

interface ResponseType<T> {
  errorCode: number;
  message: string;
  data: T;
  statusCode: number;
  errors: ResponseErrorType[];
}

export default ResponseType;
