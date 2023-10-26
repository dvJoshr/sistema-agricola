export class Mayorizacion {
  daily_book_id_fk = "";
  codigo_chartAccount = "";
  referencia = "";
  deudor = 0;
  acreedor = 0;
  /**
   *
   */
  constructor(
    daily_book_id_fk: string,
    codigo_chartAccount: string,
    referencia: string,
    deudor: number,
    acreedor: number
  ) {
    this.daily_book_id_fk = daily_book_id_fk;
    this.codigo_chartAccount = codigo_chartAccount;
    this.referencia = referencia;
    this.deudor = deudor;
    this.acreedor = acreedor;
  }
}
