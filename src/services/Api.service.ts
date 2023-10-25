import { environment } from "@/environments/enviroments";
import axios from "axios";
export default () => {
  return axios.create({
    baseURL: `${environment.PROTOCOL_API}://${environment.HOST_API}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};
