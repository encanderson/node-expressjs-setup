export class Forbideen extends Error {
  idError: number;
  constructor() {
    super("Acesso negado.");
    this.name = "Forbideen";
    this.idError = 7;
  }
}
