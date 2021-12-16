export class UserExist extends Error {
  idError: number;
  constructor(user: string) {
    super(`Usuário(a) ${user} já existe.`);
    this.name = "UserExist";
    this.idError = 1;
  }
}
