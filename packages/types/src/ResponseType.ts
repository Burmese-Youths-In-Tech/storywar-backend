interface ResponseType<T> {
  isSuccess: boolean;
  errorCode: number;
  message: string;
  data: T;
  statusCode: number;
}

export default ResponseType;
