export interface IException {
  code: string;
  message?: string | null;
  path?: string | null;
  data?: any;
}

export interface IExceptions {
  exceptions: IException[];
  body: any;
}

export type Exceptions = IException[];

export interface ExceptionRes {
  error: true;
  args: Object;
  exceptions: Exceptions;
}
