class AppErr extends Error {
  keyValue(keyValue: any) {
    throw new Error('Method not implemented.');
  }
  code: number | undefined;
  path: unknown;

  constructor(message: string, public statusCode: number) {
    super(message);

    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppErr;
