export class NotAuthenticate extends Error {
  idError: number;
  constructor(field: string) {
    super(`${field} não corresponde.`);
    this.name = "NotAuthenticate";
    this.idError = 4;
  }
}
