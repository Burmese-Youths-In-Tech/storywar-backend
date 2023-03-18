interface ModalResponseType<T> {
  isSuccess: boolean;
  data: T;
  message: string;
}

export default ModalResponseType;
