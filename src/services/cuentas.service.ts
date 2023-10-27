import { Cuenta } from "@/models/cuenta";
import api from "./Api.service";
export default {
  async getAccount() {
    return await api().get("account");
  },

  async saveAccount(account: Cuenta) {
    return await api().post("account", account);
  },

  async getAccountById(id: string) {
    return await api().get(`account/${id}`);
  },
};
