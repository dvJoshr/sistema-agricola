<template>
  <v-panel header="Cuenta contable">
    <v-toast />
    <v-confirm-dialog></v-confirm-dialog>
    <div>
      <v-button label="Agregar" size="small" @click="visible = true"></v-button>
    </div>
    <v-datatable-table
      :value="products"
      paginator
      :rows="9"
      :rowsPerPageOptions="[10, 20, 50]"
      class="p-datatable-sm"
    >
      <v-datatable-column field="codigo" header="Código"></v-datatable-column>
      <v-datatable-column field="titulo" header="Título"></v-datatable-column>
      <v-datatable-column field="detalle" header="Detalle"></v-datatable-column>
      <v-datatable-column field="opciones" header="Opciones">
        <template #body="slotProps">
          <v-button
            type="button"
            icon="pi pi-pencil"
            severity="warning"
            class="mr-2 p-0"
            rounded
            text
            @click="editCuenta(slotProps.data)"
          >
          </v-button>
          <v-button
            type="button"
            icon="pi pi-trash"
            text
            class="p-0 h-1"
            severity="danger"
            rounded
            @click="eliminarCuenta(slotProps.data)"
          >
          </v-button>
        </template>
      </v-datatable-column>
    </v-datatable-table>
  </v-panel>
  <div>
    <v-dialog
      v-model:visible="visible"
      modal
      header="Ingreso de cuenta"
      :style="{ width: '45vw' }"
      :draggable="false"
    >
      <form action="">
        <div class="w-full formgroup-inline justify-content-evenly pl-4 pr-4">
          <div class="w-full">
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
          <div class="w-full">
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
        <v-button
          type="submit"
          :label="nombreButtom"
          @click="onSubmit()"
        ></v-button>
        <v-button
          label="Cancelar"
          severity="danger"
          @click="resetForm()"
        ></v-button>
      </div>
    </v-dialog>
  </div>
</template>
<script lang="ts">
// import { CuentasService } from "../services/cuentas.service";
import { Cuenta } from "@/models/cuenta";
import CuentasService from "@/services/cuentas.service";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { computed, onMounted, reactive, ref } from "vue";

export default {
  name: "cuenta-contable",
  setup() {
    let products = ref([{}]);
    const toast = useToast();
    const confirm = useConfirm();
    let nombreButtom = ref("Ingresar");
    let visible = ref(false);
    let codigo_antiguo = ref("");
    let eliminar = ref(false);
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
      if (codigoEvents.codigoValue === "") {
        return "El código es requerido";
      } else return "";
    });

    const tituloErrorMessage = computed(() => {
      if (tituloEvents.tituloError !== "") {
        return "El titulo es requerido";
      } else return "";
    });
    const detalleErrorMessage = computed(() => {
      if (detalleEvents.detalleError !== "") {
        return detalleEvents.detalleError;
      } else return "";
    });

    const saveCuenta = async (cuenta: Cuenta) => {
      await CuentasService.saveAccount(cuenta);
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
      if (codigoEvents.codigoValue !== "" && tituloEvents.tituloValue !== "") {
        let cuenta: Cuenta = new Cuenta(
          codigoEvents.codigoValue,
          tituloEvents.tituloValue,
          detalleEvents.detalleValue
        );
        if (nombreButtom.value === "Editar") {
          CuentasService.updateAccount({
            codigo_nuevo: codigoEvents.codigoValue,
            titulo: tituloEvents.tituloValue,
            detalle: detalleEvents.detalleValue,
            codigo_antiguo: codigo_antiguo.value,
          })
            .then((data: any) => {
              toast.add({
                severity: "success",
                summary: "Success Message",
                detail: "La cuenta se actualizó correctamente",
                life: 3000,
              });
              resetForm();
            })
            .catch((err) => {
              toast.add({
                severity: "error",
                summary: "Error",
                detail: "La cuenta no se actualizó correctamente",
                life: 3000,
              });
            })
            .finally(() => (visible.value = false));
          return;
        }
        await saveCuenta(cuenta)
          .then((data: unknown) => {
            toast.add({
              severity: "success",
              summary: "Success Message",
              detail: "La cuenta se guardo correctamente",
              life: 3000,
            });
            products.value.push(cuenta);
            resetForm();
          })
          .catch((err) => {
            toast.add({
              severity: "error",
              summary: "Error",
              detail: "Error al guardar la cuenta",
              life: 3000,
            });
          })
          .finally(() => (visible.value = false));
        resetForm();
      } else {
        if (codigoEvents.codigoValue === "") {
          codigoEvents.codigoError = "Este campo es requerido";
        } else {
          codigoEvents.codigoError = "";
        }

        if (tituloEvents.tituloValue === "") {
          tituloEvents.tituloError = "Este campo es requerido";
        } else {
          tituloEvents.tituloError = "";
        }
        if (detalleEvents.detalleValue === "") {
          detalleEvents.detalleError = "Este campo es requerido";
        } else {
          detalleEvents.detalleError = "";
        }
      }
    };

    const getCuentas = () => {
      CuentasService.getAccount()
        .then((response) => {
          products.value = response.data.filter(
            (cuenta: any) => cuenta.estado === "ACTIVO"
          );
        })
        .catch((err) => console.log(err));
    };

    const editCuenta = (item: Cuenta) => {
      codigoEvents.codigoValue = item.codigo;
      detalleEvents.detalleValue = item.detalle;
      tituloEvents.tituloValue = item.titulo;
      visible.value = true;
      nombreButtom.value = "Editar";
      codigo_antiguo.value = item.codigo;
    };
    const eliminarCuenta = (item: any) => {
      confirm.require({
        message: "Desea eliminar este Cuenta?",
        header: "Confirmar",
        icon: "pi pi-info-circle",
        rejectClass: "p-button-text p-button-text",
        acceptClass: "p-button-danger p-button-text",
        accept: () => {
          CuentasService.deleteAccount(item.codigo).then((res: any) => {
            let index = products.value.indexOf(
              (cuenta: any) => cuenta.codigo === item.codigo
            );
            products.value.splice(index, 1);
            toast.add({
              severity: "info",
              summary: "Confirmar",
              detail: "Cuenta eliminada",
              life: 3000,
            });
          });
        },
        reject: () => {
          toast.add({
            severity: "error",
            summary: "Cancelar",
            detail: "Cancelar",
            life: 3000,
          });
        },
      });
    };
    onMounted(() => {
      getCuentas();
    });

    return {
      codigoEvents,
      onSubmit,
      tituloEvents,
      detalleEvents,
      products,
      codigoErrorMessage,
      tituloErrorMessage,
      detalleErrorMessage,
      resetForm,
      visible,
      getCuentas,
      editCuenta,
      nombreButtom,
      eliminar,
      eliminarCuenta,
    };
  },
};
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
.p-button.p-button-icon-only.p-button-rounded {
  height: 1.9rem !important;
  width: 1.9rem !important;
}
</style>
