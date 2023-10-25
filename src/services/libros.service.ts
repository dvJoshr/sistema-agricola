import { Transaction } from "@/models/Transaction";
import { libro } from "@/models/libro";
import api from "./Api.service";
export default {
  getBooks() {
    return api().get("books");
  },

  async getBooksDetails(id: string) {
    return await api().get(`details/${id}`);
  },
  async saveBook(model: libro) {
    return await api().post("/books", model);
  },

  async saveTransaccion(model: Transaction[]) {
    return await api().post("/details", model);
  },

  async getCuentas(id: string) {
    return await api().get(`/details/cuentas/${id}`);
  },

  async getBooksByIdAndCuenta(id: string, cuenta: string) {
    return await api().get(`details/books/${id}&${cuenta}`);
  },
};