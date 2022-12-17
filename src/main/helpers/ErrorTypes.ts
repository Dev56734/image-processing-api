export class FileNotFoundError extends Error {
  constructor(message: string | undefined = undefined) {
    super(message);
  }
}
