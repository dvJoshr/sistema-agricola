export class Cuenta {
  codigo: string;
  titulo: string;
  detalle: string;

  constructor(codigo: string, titulo: string, detalle: string) {
    this.codigo = codigo;
    this.titulo = titulo;
    this.detalle = detalle;
  }
}
