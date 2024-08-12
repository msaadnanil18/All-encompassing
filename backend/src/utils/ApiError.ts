interface ErrorResponse {
  message: string;
  errors?: any[];
  stack?: string;
}

class ApiError extends Error {
  public statusCode: number;
  public data: null;
  public message: string;
  public success: boolean;
  public errors: any[];

  constructor(
    statusCode: number,
    {
      message = 'something went wrong',
      errors = [],
      stack = '',
    }: Partial<ErrorResponse> = {}
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
