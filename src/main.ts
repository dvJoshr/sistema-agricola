import "primeflex/primeflex.css";
import "primeflex/themes/primeone-light.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/lara-light-teal/theme.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import { CuentasService } from "./services/cuentas.service";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Card from "primevue/card";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Menu from "primevue/menu";
import Panel from "primevue/panel";
import Sidebar from "primevue/sidebar";
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import LayoutContent from "./components/Layout-content.vue";
import ApiService from "./services/Api.service";

import "/node_modules/primeflex/primeflex.css";

const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.component("v-panel", Panel);
app.component("v-menu", Menu);
app.component("v-sidebar", Sidebar);
app.component("v-button", Button);
app.component("v-datatable-table", DataTable);
app.component("v-datatable-column", Column);
app.component("v-card", Card);
app.component("v-inputtext", InputText);
app.component("v-textarea", Textarea);
app.component("v-dialog", Dialog);
app.component("LayoutContent", LayoutContent);
app.component("v-calendar", Calendar);
app.component("v-dropdown", Dropdown);
app.component("v-inputnumber", InputNumber);
app.component("v-toast", Toast);
//providers

app.provide("api", ApiService());
app.mount("#app");
