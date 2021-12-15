export class UserExist extends Error {
  idError: number;
  constructor() {
    super("Usuário já existe.");
    this.name = "UserExist";
    this.idError = 1;
  }
}
