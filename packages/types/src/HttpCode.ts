interface HttpCodeType {
  OK: 200;
  NO_CONTENT: 204;
  BAD_REQUEST: 400;
  UNAUTHORIZED: 401;
  NOT_FOUND: 404;
  INTERNAL_SERVER_ERROR: 500;
}

const HttpCode: HttpCodeType = {
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export default Object.freeze(HttpCode);
