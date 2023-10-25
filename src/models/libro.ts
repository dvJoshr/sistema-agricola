export class libro {
  daily_book_id: string;
  fecha: string;
  titulo: string;
  tema: string;
  constructor(
    daily_book_id: string,
    fecha: string,
    titulo: string,
    tema: string
  ) {
    this.daily_book_id = daily_book_id;
    this.fecha = fecha;
    this.titulo = titulo;
    this.tema = tema;
  }
}
