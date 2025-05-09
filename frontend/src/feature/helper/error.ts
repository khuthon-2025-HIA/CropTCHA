export class AcceptableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AcceptableError';
  }

  override toString() {
    return this.message;
  }
}

export class ResponseError extends AcceptableError {
  constructor(message: string) {
    super(message);
    this.name = 'ResponseError';
  }
}

export const isAcceptable = (error: unknown): error is AcceptableError => {
  if (error instanceof AcceptableError) return true;
  if (error instanceof ResponseError) return true;

  return false;
};
