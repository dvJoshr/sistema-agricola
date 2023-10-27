<template>
  <div>
    <v-panel header="Mayorización">
      <v-toast />

      <template #icons>
        <button
          class="p-panel-header-icon p-link mr-2"
          style="width: 16px; height: 16px !important"
          @click="backToItems()"
        >
          <span class="pi pi-times"></span>
        </button>
      </template>
      <div
        class="flex flex-row justify-content-start flex-wrap"
        style="calc(100vh - 12rem) !important"
        v-if="mostrarLibros"
      >
        <div
          v-for="libroItem in listaLibros"
          :key="libroItem.daily_book_id"
          class="w-2 m-2"
          @click="getItem(libroItem)"
        >
          <!-- @click="getItem(libroItem)" -->
          <v-card>
            <template #header>
              <span><i class="pi pi-book" style="font-size: 2rem"></i></span>
            </template>
            <template #content>
              <span :value="libroItem.daily_book_id"
                >{{ libroItem.tema }}
              </span>
            </template>
          </v-card>
        </div>
      </div>

      <div
        v-if="!mostrarLibros"
        class="table-responsive flex flex-row justify-content-between"
      >
        <div class="w-full flex flex-column" style="min-width: 5rem">
          <div class="flex flex-column">
            <label for="" class="mb-2">Cuenta Deudora</label>
            <label for="" class="mb-2 font-semibold">{{ totalDeudor }}</label>
          </div>
          <div class="flex flex-column">
            <label for="" class="mb-2">Cuenta Acreedora</label>
            <label for="" class="mb-2 font-semibold">{{ totalAcreedor }}</label>
          </div>
        </div>
        <div>
          <v-datatable-table
            :value="listaMayorizados"
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50]"
            :class="'p-datatable-sm'"
            tableStyle="min-width: 50rem"
          >
            <v-datatable-column
              sortable
              field="cuenta_id"
              header="Codigo"
            ></v-datatable-column>
            <v-datatable-column
              field="detalle"
              header="Cuentas"
            ></v-datatable-column>
            <v-datatable-column
              field="deudor"
              header="Deudor"
            ></v-datatable-column>
            <v-datatable-column
              field="acreedor"
              header="Acreedor"
            ></v-datatable-column>
          </v-datatable-table>
        </div>
      </div>
    </v-panel>
    <div>
      <!-- <v-dialog
        v-model:visible="mostrar"
        header="Header"
        modal
        :style="{ width: '40vw' }"
      >
        <form action="">
          <div class="flex flex-row justify-content-between m-2">
            <div>
              <label for="idLibro" class="block text-900 font-medium mb-2">
                Libro
              </label>
              <v-inputtext
                disabled
                id="idLibro"
                name="idLibro"
                aria-describedby="text-error"
                class="w-full md:w-14rem"
                v-model="idLibro"
              ></v-inputtext>
            </div>
            <div>
              <label for="cuentaid" class="block text-900 font-medium mb-2">
                Field
              </label>
              <v-dropdown
                name="cuentaid"
                placeholder="Cuentas contables"
                id="cuentaid"
                showClear
                :options="listaCuentas"
                optionLabel="codigo_chartaccount"
                class="w-full md:w-14rem"
                v-model="cuentaValue"
              ></v-dropdown>
            </div>
          </div>
        </form>
        <div>
          <v-button
            label="Generar"
            text
            @click="getBooksMayor(idLibro, cuentaValue.codigo_chartaccount)"
          ></v-button>
        </div>
      </v-dialog> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Cuenta } from "@/models/cuenta";
import { libro } from "@/models/libro";
import cuentasServicio from "@/services/cuentas.service";
import librosSevice from "@/services/libros.service";
import { useToast } from "primevue/usetoast";
import { computed, onMounted, ref } from "vue";
export default {
  components: {},
  setup() {
    const toast = useToast();
    let mostrarLibros = ref(true);
    let components = ref<string[]>([]);
    let listaLibros = ref<libro[]>([]);
    let mostrar = ref(false);
    let idLibro = ref("");
    let libroValue = ref("");
    let listaCuentas = ref([]);
    let cuentaValue = ref({ codigo_chartaccount: "" });
    let cuentaValor = ref("");
    let acreedor = ref(0);
    let saldoMayorizacion = ref(0);
    let deudor = ref(0);
    let listaMayorizados = ref([[]]);
    let totalAcreedor = ref(0);
    let totalDeudor = ref(0);
    const addMayorizacionPorCuenta = () => {
      components.value.push("componenteTable");
    };
    const getBooks = () => {
      librosSevice.getBooks().then((response) => {
        listaLibros.value = response.data;
      });
    };

    const getItem = (item: libro) => {
      idLibro.value = item.daily_book_id;

      librosSevice
        .getCuentas(item.daily_book_id)
        .then((response) => {
          response.data.forEach((element: any) => {
            cuentasServicio
              .getAccountById(element.codigo_chartaccount)
              .then((cuenta: any) => {
                if (cuenta.data !== null) {
                  let account = cuenta.data as Cuenta;
                  librosSevice
                    .getBooksByIdAndCuenta(
                      item.daily_book_id,
                      element.codigo_chartaccount
                    )
                    .then((res) => {
                      res.data.forEach((elem: any) => {
                        saldoMayorizacion.value += elem.debe - elem.haber;
                      });
                      if (saldoMayorizacion.value > 0) {
                        deudor.value = saldoMayorizacion.value;
                      } else if (saldoMayorizacion.value < 0) {
                        acreedor.value = saldoMayorizacion.value * -1;
                      } else {
                        deudor.value = 0;
                        acreedor.value = 0;
                      }
                      let mayor: any = {
                        cuenta_id: element.codigo_chartaccount,
                        detalle: account.titulo ?? "",
                        deudor: deudor.value,
                        acreedor: acreedor.value,
                      };
                      listaMayorizados.value.push(mayor);
                      totalAcreedor.value =
                        totalAcreedor.value + acreedor.value;
                      totalDeudor.value = totalDeudor.value + deudor.value;

                      deudor.value = 0;
                      acreedor.value = 0;
                      saldoMayorizacion.value = 0;
                    });
                }
              });
          });
          listaMayorizados.value.shift();

          mostrarLibros.value = false;
        })
        .catch((error) => {
          console.log(error);
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "No existen transacciones",
            life: 3000,
          });
          toast.add({
            severity: "info",
            summary: "Información",
            detail: "Por favor, ingrese transacciones",
            life: 3000,
          });
        });
    };

    const showFormCuenta = () => {
      mostrar.value = true;
    };
    const getBooksMayor = (id: string, cuenta: string) => {
      // librosSevice.getBooksByIdAndCuenta(id, cuenta).then((response) => {
      //   let respuesta = response.data;
      //   let credito = 0;
      //   let acreedor = 0;
      //   for (let index = 0; index < respuesta.length; index++) {
      //     if (respuesta[index].debe > 0 && respuesta[index].haber == 0) {
      //       credito = credito + parseFloat(respuesta[index].debe);
      //     } else if (
      //       respuesta[index].debe == 0 &&
      //       respuesta[index].haber > 0 &&
      //       credito == 0
      //     ) {
      //       acreedor = acreedor + parseFloat(respuesta[index].haber);
      //     } else if (credito > 0 && respuesta[index].haber > 0) {
      //       credito = credito - parseFloat(respuesta[index].haber);
      //     }
      //     console.log(credito, acreedor);
      //   }
      // });

      listaCuentas.value = listaCuentas.value.filter(
        (cuentas: any) => cuentas.codigo_chartaccount !== cuenta
      );
      cuentaValor.value = cuenta;
      cuentaValue.value = {
        codigo_chartaccount: "",
      };
    };
    const backToItems = () => {
      mostrarLibros.value = true;
      listaMayorizados.value = [];
      totalAcreedor.value = 0;
      totalDeudor.value = 0;
    };
    const accounts = computed(() => {
      return listaCuentas;
    });
    onMounted(() => {
      getBooks();
    });
    return {
      components,
      showFormCuenta,
      mostrar,
      listaLibros,
      idLibro,
      mostrarLibros,
      libroValue,
      listaCuentas,
      cuentaValue,
      getBooks,
      getItem,
      getBooksMayor,
      addMayorizacionPorCuenta,
      cuentaValor,
      listaMayorizados,
      totalDeudor,
      totalAcreedor,
      backToItems,
    };
  },
};
</script>

<style>
.p-card {
  background: #cdfff4;
}
.table-responsive {
}
.p-card-header {
  text-align: center !important;
  padding-top: 1.5rem;
}
.p-card-content {
  text-align: center !important;
  font: 1.3em sans-serif;
}
.p-panel-content {
  background: #f3f3f3;
  height: calc(100vh - 8.6rem) !important;
}
.p-panel-icons {
  height: 16px !important;
}
</style>
