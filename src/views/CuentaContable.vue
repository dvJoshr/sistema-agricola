<template>
  <v-panel header="Cuenta contable">
    <div>
      <v-button label="Agregar" size="small" @click="visible = true"></v-button>
    </div>
    <v-datatable-table
      :value="products"
      paginator
      :rows="9"
      class="p-datatable-sm"
    >
      <v-datatable-column field="codigo" header="Código"></v-datatable-column>
      <v-datatable-column field="titulo" header="Título"></v-datatable-column>
      <v-datatable-column field="detalle" header="Detalle"></v-datatable-column>
    </v-datatable-table>
  </v-panel>
  <div>
    <v-dialog
      v-model:visible="visible"
      modal
      header="Header"
      :style="{ width: '45vw' }"
    >
      <form action="">
        <div class="w-full formgroup-inline justify-content-evenly pl-2 pr-2">
          <div>
            <label for="codigo" class="block text-900 font-medium mb-2">
              Código
            </label>
            <div class="flex flex-column">
              <v-inputtext
                placeholder="Código"
                id="codigo"
                name="codigo"
                :class="{ 'p-invalid': codigoEvents.codigoError }"
                :error="codigoEvents.codigoError"
                aria-describedby="text-error"
                v-model="codigoEvents.codigoValue"
              ></v-inputtext>
              <small id="text-error" class="p-error">{{
                codigoErrorMessage || "&nbsp;"
              }}</small>
            </div>
          </div>
          <div>
            <label for="titulo" class="block text-900 font-medium mb-2"
              >Título</label
            >
            <div class="flex flex-column">
              <v-inputtext
                placeholder="Título"
                id="titulo"
                name="titulo"
                :class="{ 'p-invalid': tituloEvents.tituloError }"
                :error="tituloEvents.tituloError"
                aria-describedby="text-error"
                v-model="tituloEvents.tituloValue"
              ></v-inputtext>
              <small id="text-error" class="p-error">{{
                tituloErrorMessage || "&nbsp;"
              }}</small>
            </div>
          </div>
        </div>
        <div class="pr-4 pl-4">
          <label for="detalle " class="block text-900 font-medium mb-2"
            >Detalle</label
          >
          <v-textarea
            placeholder="Detalle"
            id="detalle"
            name="detalle"
            class="w-full"
            v-model="detalleEvents.detalleValue"
          ></v-textarea>
        </div>
      </form>
      <div class="w-full flex justify-content-evenly pl-2 pr-2 mt-4">
        <v-button type="submit" label="Ingresar" @click="onSubmit()"></v-button>
        <v-button label="Cancelar" severity="danger"></v-button>
      </div>
    </v-dialog>
  </div>
</template>
<script lang="ts">
// import { CuentasService } from "../services/cuentas.service";
import { Cuenta } from "@/models/cuenta";
import CuentasService from "@/services/cuentas.service";
import { computed, defineComponent, reactive, ref } from "vue";
export default defineComponent({
  name: "cuenta-contable",
  data() {
    return {
      visible: false,
    };
  },
  setup() {
    let products = ref([{}]);

    const codigoEvents = reactive({
      codigoValue: "",
      codigoError: "",
    });
    const detalleEvents = reactive({
      detalleValue: "",
      detalleError: "",
    });
    const tituloEvents = reactive({
      tituloValue: "",
      tituloError: "",
    });

    const codigoErrorMessage = computed(() => {
      if (codigoEvents.codigoError !== "") {
        return codigoEvents.codigoError;
      } else return "";
    });

    const tituloErrorMessage = computed(() => {
      if (tituloEvents.tituloError !== "") {
        return tituloEvents.tituloError;
      } else return "";
    });
    const detalleErrorMessage = computed(() => {
      if (detalleEvents.detalleError !== "") {
        return detalleEvents.detalleError;
      } else return "";
    });

    const saveCuenta = async (cuenta: Cuenta) => {
      const response = await CuentasService.saveAccount(cuenta);
      console.log(response);
    };
    const resetForm = () => {
      detalleEvents.detalleValue = "";
      codigoEvents.codigoValue = "";
      tituloEvents.tituloValue = "";
      codigoEvents.codigoError = "";
      detalleEvents.detalleError = "";
      tituloEvents.tituloError = "";
    };

    const onSubmit = async () => {
      if (
        codigoEvents.codigoValue !== "" &&
        detalleEvents.detalleValue !== "" &&
        tituloEvents.tituloValue !== ""
      ) {
        let cuenta: Cuenta = new Cuenta(
          codigoEvents.codigoValue,
          tituloEvents.tituloValue,
          detalleEvents.detalleValue
        );
        await saveCuenta(cuenta)
          .then((data) => {
            console.log(data);
            products.value.push(cuenta);
            resetForm();
          })
          .catch((err) => console.log(err));
        resetForm();
      }
    };

    return {
      codigoEvents,
      onSubmit,
      tituloEvents,
      detalleEvents,
      products,
      codigoErrorMessage,
      tituloErrorMessage,
      detalleErrorMessage,
    };
  },
  methods: {
    async getCuentas() {
      await CuentasService.getAccount()
        .then((response) => {
          this.products = response.data;
        })
        .catch((err) => console.log(err));
    },
  },

  created() {
    this.getCuentas();
  },
});
</script>
<style>
.p-panel-header {
  background: rgb(130, 205, 189) !important;
  color: white;
}

.placement-custom {
  top: 4.1rem !important;
  left: calc(100% / 4);
}
</style>
