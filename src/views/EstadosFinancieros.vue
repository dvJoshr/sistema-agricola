<template>
  <v-panel header="Estados financieros">
    <v-toast />
    <v-confirm-dialog></v-confirm-dialog>
    <template #icons>
      <button class="p-panel-header-icon p-link mr-2" style="width: 16px; height: 16px !important" @click="backToItems()">
        <span class="pi pi-times"></span>
      </button>
    </template>
    <div class="flex flex-row justify-content-start flex-wrap" v-if="mostrarLibros">
      <div v-for="libroItem in listaLibros" :key="libroItem.daily_book_id" class="w-2 m-2" @click="getEstado(libroItem)">
        <v-card class="h-full">
          <template #header>
            <span><i class="pi pi-book" style="font-size: 2rem"></i></span>
          </template>
          <template #content>
            <span :value="libroItem.daily_book_id">{{ libroItem.tema }} </span>
          </template>
        </v-card>
      </div>
    </div>

    <div v-if="!mostrarLibros" class="m-auto p-auto flex flex-column align-items-center">
      <h3>ESTADO DE RESULTADOS DE PERDIDAS O GANANCIAS</h3>
      <section class="text-center border-1 w-9">
        <header>
          <p class="mb-0 mt-0">{{ titulo }}</p>
          <p class="mb-0 mt-0">De Celedonio Ojeda</p>
          <p class="mb-0 mt-0">{{ fecha }}</p>
          <p class="mb-0 mt-0">ESTADO DE PERDIDAS Y GANANCIAS</p>
          <p class="mb-0 mt-0">(En dólares americanos)</p>
        </header>
        <div class="flex justify-content-evenly border-top-1">
          <div class="h-full border-right-1 flex-1"><p>Cuentas</p></div>
          <div class="h-full flex-1"><p>Valores Unitarios</p></div>
          <div class="h-full border-left-1 flex-1"><p>Valores Totales</p></div>
        </div>
        <main class="border-top-1">
          <div>
            <v-datatable-table :value="cuentasInicioCuatro" :rows="9" class="p-datatable-sm">
              <v-column-group type="header">
                <v-row>
                  <v-datatable-column header="4. INGRESOS"></v-datatable-column>
                </v-row>
              </v-column-group>
              <v-datatable-column style="width: 50%" field="codigo_chartaccount"> </v-datatable-column>
              <v-datatable-column field="haber"> </v-datatable-column>
              <v-datatable-column></v-datatable-column>
              <v-column-group type="footer">
                <v-row>
                  <v-datatable-column style="width: 50%" footer="TOTAL DE INGRESOS:" :colspan="1" footerStyle="text-align:left"></v-datatable-column>
                  <v-datatable-column :footer="totalCuentaCuatro"></v-datatable-column>
                  <v-datatable-column></v-datatable-column>
                </v-row>
              </v-column-group>
              <!-- <v-datatable-column field="titulo" header="Título">
              </v-datatable-column>
              <v-datatable-column field="detalle" header="Detalle">
              </v-datatable-column> -->
            </v-datatable-table>
            <v-datatable-table :value="cuentasInicioCinco" :rows="9" class="p-datatable-sm">
              <v-column-group type="header">
                <v-row>
                  <v-datatable-column header="5. COSTOS Y GASTOS"></v-datatable-column>
                </v-row>
              </v-column-group>
              <v-datatable-column style="width: 50%" field="codigo_chartaccount"> </v-datatable-column>
              <v-datatable-column field="debe"> </v-datatable-column>
              <v-datatable-column></v-datatable-column>
              <v-column-group type="footer">
                <v-row>
                  <v-datatable-column footer="TOTAL COSTOS Y GASTOS" :colspan="1" footerStyle="text-align:left"></v-datatable-column>
                  <v-datatable-column :footer="totalCuentaCinco"></v-datatable-column>
                </v-row>
                <v-row>
                  <v-datatable-column footer="UTILIDAD" :colspan="1" footerStyle="text-align:LEFT"></v-datatable-column>
                  <v-datatable-column></v-datatable-column>
                  <v-datatable-column :footer="totalCuentaCuatro + totalCuentaCinco"></v-datatable-column>
                </v-row>
              </v-column-group>
            </v-datatable-table>
          </div>
        </main>
      </section>
    </div>
  </v-panel>
</template>

<script lang="ts">
import { libro } from "@/models/libro";
import librosSevice from "@/services/libros.service";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { onMounted, ref } from "vue";
export default {
  setup() {
    let cuentasInicioCuatro = ref([{}]);
    let listaLibros = ref<libro[]>([]);
    let cuentasInicioCinco = ref([{}]);
    let totalCuentaCuatro = ref(0);
    let totalCuentaCinco = ref(0);
    let mostrarLibros = ref(true);
    let libroItem = ref({});
    let titulo = ref("");
    let fecha = ref("");
    let tema = ref("");
    const confirm = useConfirm();
    const toast = useToast();
    const getBooks = () => {
      librosSevice.getBooks().then((response) => {
        listaLibros.value = response.data;
      });
    };

    const getEstado = async (item: any) => {
      titulo.value = item.titulo;
      libroItem = item;
      fecha.value = item.fecha;
      let aux: any[] = [];
      let aux2: any[] = [];
      await librosSevice
        .getBooksDetailsToStates("5.0", "4.0", item.daily_book_id)
        .then((response) => {
          response.data.forEach((cuenta: any) => {
            if (cuenta.codigo_chartaccount.startsWith("5.0")) {
              aux.push(cuenta);
            } else if (cuenta.codigo_chartaccount.startsWith("4.0")) {
              aux2.push(cuenta);
            }
          });
          cuentasInicioCinco.value = aux;
          cuentasInicioCuatro.value = aux2;
          totalCuentaCinco.value = aux.reduce((acumulador: number, cuenta: any) => acumulador + parseInt(cuenta.debe), 0);
          totalCuentaCuatro.value = aux.reduce((acumulador: number, cuenta: any) => acumulador + parseInt(cuenta.haber), 0);
          if (cuentasInicioCinco.value.length === 0) {
            confirm.require({
              message: "No contiene costos y gastos, desea continuar?",
              header: "Confirmar",
              icon: "pi pi-info-circle",
              rejectClass: "p-button-text p-button-text",
              acceptClass: "p-button-danger p-button-text",
              accept: () => {
                toast.add({
                  severity: "success",
                  summary: "Success Message",
                  detail: "Estado financiero generado correctamente",
                  life: 3000,
                });
                mostrarLibros.value = false;
              },
              reject: () => {
                toast.add({
                  severity: "info",
                  summary: "Cancelado",
                  detail: "Cancelado",
                  life: 3000,
                });
                mostrarLibros.value = true;
              },
            });
          } else if (cuentasInicioCuatro.value.length === 0) {
            confirm.require({
              message: "No contiene ingresos, desea continuar?",
              header: "Confirmar",
              icon: "pi pi-info-circle",
              rejectClass: "p-button-text p-button-text",
              acceptClass: "p-button-danger p-button-text",
              accept: () => {
                toast.add({
                  severity: "success",
                  summary: "Success Message",
                  detail: "Estado financiero generado correctamente",
                  life: 3000,
                });
                mostrarLibros.value = false;
              },
              reject: () => {
                toast.add({
                  severity: "info",
                  summary: "Cancelado",
                  detail: "Cancelado",
                  life: 3000,
                });
                mostrarLibros.value = true;
              },
            });
          } else {
            toast.add({
              severity: "success",
              summary: "Success Message",
              detail: "Estado financiero generado correctamente",
              life: 3000,
            });
          }
        })
        .catch((err) => console.log(err));
    };
    const backToItems = () => {
      getBooks();
      mostrarLibros.value = true;
    };
    onMounted(() => {
      getBooks();
    });
    return {
      cuentasInicioCuatro,
      cuentasInicioCinco,
      totalCuentaCuatro,
      totalCuentaCinco,
      mostrarLibros,
      backToItems,
      listaLibros,
      libroItem,
      getEstado,
      getBooks,
      titulo,
      fecha,
      tema,
    };
  },
};
</script>
