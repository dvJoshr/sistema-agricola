export class Transaction {
  daily_book_id_fk = "";
  codigo_chartaccount = "";
  detalle = "";
  debe = 0;
  haber = 0;
  referencia = "";
  /**
   *
   */
  constructor(
    daily_book_id_fk: string,
    codigo_chartaccount: string,
    detalle: string,
    debe: number,
    haber: number,
    referencia: string
  ) {
    this.daily_book_id_fk = daily_book_id_fk;
    this.codigo_chartaccount = codigo_chartaccount;
    this.detalle = detalle;
    this.debe = debe;
    this.haber = haber;
    this.referencia = referencia;
  }
}
