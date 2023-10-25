<template>
  <div>
    <v-panel header="Mayorización">
      <div
        class="flex flex-row bg-green-300 justify-content-evenly flex-wrap"
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

      <div v-if="!mostrarLibros">
        <v-button
          label="Nuevo componente"
          @click="showFormCuenta"
          text
        ></v-button>
        <div v-for="componente in components" :key="componente">
          <componenteTable
            :idLibro="idLibro"
            :codigo="cuentaValue.codigo_chartaccount"
          ></componenteTable>
        </div>
      </div>
    </v-panel>
    <div>
      <v-dialog
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
            label="Generar Mayorización"
            text
            @click="getBooksMayor(idLibro, cuentaValue.codigo_chartaccount)"
          ></v-button>
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { libro } from "@/models/libro";
import librosSevice from "@/services/libros.service";
import componenteTable from "@/views/componentes/componente-table.vue";
import { onMounted, ref } from "vue";
export default {
  components: { componenteTable },
  setup() {
    let mostrarLibros = ref(true);
    let components = ref<string[]>([]);
    let listaLibros = ref<libro[]>([]);
    let mostrar = ref(false);
    let idLibro = ref("");
    let libroValue = ref("");
    let listaCuentas = ref([]);
    let cuentaValue = ref({ codigo_chartaccount: "" });
    const showFormCuenta = () => {
      mostrar.value = true;
    };

    const addMayorizacionPorCuenta = () => {
      components.value.push("componenteTable");
    };
    const getBooks = () => {
      librosSevice.getBooks().then((response) => {
        listaLibros.value = response.data;

        console.log(response.data);
      });
    };

    const getItem = (item: libro) => {
      idLibro.value = item.daily_book_id;
      librosSevice.getCuentas(item.daily_book_id).then((response) => {
        listaCuentas.value = response.data;
      });

      mostrarLibros.value = false;
    };

    const getBooksMayor = (id: string, cuenta: string) => {
      console.log(cuenta);
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
      components.value.push("componenteTable");
    };

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
    };
  },
};
</script>

<style>
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
}
.p-panel-icons {
  height: 16px !important;
}
</style>
