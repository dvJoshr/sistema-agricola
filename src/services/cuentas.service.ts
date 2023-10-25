import { Cuenta } from "@/models/cuenta";
import api from "./Api.service";
export default {
  async getAccount() {
    return await api().get("account");
  },

  async saveAccount(account: Cuenta) {
    console.log(account);
    return await api().post("account", account);
  },
};
