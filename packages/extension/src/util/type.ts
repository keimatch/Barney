export type Callback<Args extends any[], R> = (...args: Args) => R;

export interface SuccessResult<T> {
  success: true;
  value: T;
}

export interface ErrorResult {
  success: false;
  error: string;
}

export type Result<T> = SuccessResult<T> | ErrorResult;
