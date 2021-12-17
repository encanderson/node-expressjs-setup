export class InvalidField extends Error {
  idError: number;
  constructor(msg: string) {
    super(msg);
    this.name = "InvalidField";
    this.idError = 6;
  }
}
