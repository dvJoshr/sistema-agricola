<template>
  <v-panel header="Libro diario">
    <v-toast />
    <v-confirm-dialog></v-confirm-dialog>
    <template #icons>
      <button class="p-panel-header-icon p-link mr-2" style="width: 16px; height: 16px !important" @click="backToItems()">
        <span class="pi pi-times"></span>
      </button>
    </template>

    <div class="mb-2" v-if="!mostrar">
      <v-button label="Agregar" size="small" severity="warning" @click="abrirDialogLibro()"></v-button>
    </div>
    <!-- Mostrar libros -->
    <div class="flex flex-row justify-content-start flex-wrap" v-if="!mostrar">
      <div v-for="libroItem in libros" :key="libroItem.daily_book_id" class="w-2 m-2" @click="getItem(libroItem)">
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
    <!-- Presentar detalle -->
    <div v-if="mostrar">
      <div class="flex flex-wrap justify-content-between mb-2">
        <div>
          <v-button label="Editar libro" icon="pi pi-pencil" severity="warning" text @click="editBook()"></v-button>

          <v-button label="Eliminar libro" icon="pi pi-trash" severity="danger" text @click="eliminarLibro()"></v-button>
        </div>
        <v-button label="Añadir transacción" icon="pi pi-plus" text @click="openDialogDetail()" />
      </div>
      <v-datatable-table :value="details" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]" class="p-datatable-sm m-2">
        <v-datatable-column field="daily_book_id_fk" header="Libro diario"></v-datatable-column>
        <v-datatable-column field="fecha" header="Fecha"></v-datatable-column>
        <v-datatable-column field="referencia" header="Referencia"></v-datatable-column>
        <v-datatable-column field="codigo_chartaccount" header="Cuenta"></v-datatable-column>
        <v-datatable-column field="detalle" header="Detalle"></v-datatable-column>
        <v-datatable-column field="debe" header="Debe"></v-datatable-column>
        <v-datatable-column field="haber" header="Haber"></v-datatable-column>
        <v-datatable-column field="opciones" header="Opciones">
          <template #body="slotProps">
            <v-button type="button" icon="pi pi-pencil" severity="warning" class="mr-2 p-0" rounded text @click="editTransaccion(slotProps.data)"> </v-button>
            <v-button type="button" icon="pi pi-trash" text class="p-0 h-1" severity="danger" rounded @click="deleteDetail(slotProps.data)"> </v-button>
          </template>
        </v-datatable-column>
      </v-datatable-table>
    </div>
    <!-- Ingresar libro -->
    <div>
      <v-dialog v-model:visible="visible" modal :draggable="false" header="Ingresar Libro Diario" :style="{ width: '35vw' }" @hide="cancelar()">
        <form action="">
          <div>
            <div class="flex flex-row pr-4">
              <div class="mr-1">
                <label for="codigo" class="block text-900 font-medium mb-2"> Código </label>
                <div class="flex flex-column">
                  <v-inputtext disabled placeholder="Código" id="codigo" name="codigo" :class="{ 'p-invalid': codigoEvents.codigoError }" :error="codigoEvents.codigoError" class="w-full md:w-13rem" aria-describedby="text-error" v-model="codigoEvents.codigoValue"></v-inputtext>
                  <small id="text-error" class="p-error">{{ codigoErrorMessage }}</small>
                </div>
              </div>

              <div class="ml-1">
                <label for="tema" class="block text-900 font-medium mb-2"> Tema </label>
                <div class="flex flex-column">
                  <v-inputtext placeholder="Tema" id="tema" name="tema" class="w-full md:w-13rem" :class="{ 'p-invalid': temaEvents.temaError }" :error="temaEvents.temaError" aria-describedby="text-error" v-model="temaEvents.temaValue"></v-inputtext>
                  <small id="text-error" class="p-error">{{ temaErrorMessage || "&nbsp;" }}</small>
                </div>
              </div>
            </div>
            <div>
              <label for="fecha" class="block text-900 font-medium mb-2"> Fecha </label>
              <div class="flex flex-column">
                <v-calendar v-model="fechaEvents.fechaValue" showIcon dateFormat="yy-mm-dd" id="fechaLibro" name="fechaLibro" :class="{ 'p-invalid': fechaEvents.fechaError }" aria-describedby="text-error" :error="fechaEvents.fechaError" />
                <small id="text-error" class="p-error">{{ fechaErrorMessage || "&nbsp;" }}</small>
              </div>
            </div>
            <div>
              <label for="titulo" class="block text-900 font-medium mb-2">Título</label>
              <div class="flex flex-column">
                <v-textarea placeholder="Título" id="titulo" name="titulo" :class="{ 'p-invalid': tituloEvents.tituloError }" :error="tituloEvents.tituloError" aria-describedby="text-error" v-model="tituloEvents.tituloValue"></v-textarea>
                <small id="text-error" class="p-error">{{ tituloErrorMessage || "&nbsp;" }}</small>
              </div>
            </div>
          </div>
        </form>
        <div class="w-full flex justify-content-evenly pl-2 pr-2 mt-4">
          <v-button type="" @click="onSubmitLibro()" :label="accion"></v-button>
          <v-button label="Cancelar" severity="danger" @click="cancelar()"></v-button>
        </div>
      </v-dialog>
    </div>
    <!-- Ingresar libro final -->

    <!-- Ingresar detalle -->
    <div>
      <v-dialog :draggable="false" v-model:visible="dialogDetail" modal :style="{ width: '65vw' }">
        <template #header>
          <div class="flex flex-wrap justify-content-end mb-2">
            <v-button class="ml-6" label="Ingresar" icon="pi pi-plus" text @click="openDialogDetailInsert()" />
          </div>
        </template>
        <div>
          <v-datatable-table :value="transaccionList" paginator :rows="6" class="p-datatable-sm">
            <v-datatable-column field="daily_book_id_fk" header="Libro diario"></v-datatable-column>
            <v-datatable-column field="referencia" header="Referencia"></v-datatable-column>
            <v-datatable-column field="codigo_chartaccount" header="Cuenta"></v-datatable-column>
            <v-datatable-column field="fecha" header="Fecha"></v-datatable-column>
            <v-datatable-column field="detalle" header="Detalle"></v-datatable-column>
            <v-datatable-column field="debe" header="Debe"></v-datatable-column>
            <v-datatable-column field="haber" header="Haber"></v-datatable-column>
            <v-datatable-column field="opciones" header="Opciones">
              <template #body="slotProps">
                <v-button type="button" icon="pi pi-pencil" severity="warning" class="mr-2 p-0" rounded text @click="editTransaccionList(slotProps.data)"> </v-button>
                <v-button type="button" icon="pi pi-trash" text class="p-0 h-1" severity="danger" rounded @click="eliminarTransaccionList(slotProps.data)"> </v-button>
              </template>
            </v-datatable-column>
          </v-datatable-table>
        </div>
        <template #footer>
          <div class="flex flex-row justify-content-start">
            <v-button label="Guardar Transacciones" @click="guardarDetail()" />
          </div>
        </template>
      </v-dialog>
    </div>

    <div>
      <v-dialog v-model:visible="dialogDeailInsert" modal :draggable="false" header="Libro diario" :style="{ width: '40vw' }">
        <form action="">
          <div class="flex flex-row">
            <div class="w-full mr-2">
              <label for="daily_book_id_fk" class="block text-900 font-medium mb-2"> Libro Diario </label>
              <div class="flex flex-column">
                <v-inputtext id="daily_book_id_fk" name="daily_book_id_fk" class="w-full" disabled v-model="daily_book_id_fkValue"></v-inputtext>
              </div>
            </div>
            <div class="w-full ml-1">
              <label for="cuentaSeleccionada" class="block text-900 font-medium mb-2"> Cuenta </label>
              <div class="flex flex-column">
                <v-dropdown
                  :options="listaCuentas"
                  optionLabel="name"
                  placeholder="Cuentas contables"
                  class="w-full"
                  v-model="cuentaEvent.cuentaValue"
                  id="cuentaSeleccionada"
                  name="cuentaSeleccionada"
                  :class="{
                    'p-invalid': cuentaEvent.cuentaError,
                  }"
                  :error="cuentaEvent.cuentaError"
                  aria-describedby="text-error"></v-dropdown>
                <small id="text-error" class="p-error">{{ cuentaErroMessage || "&nbsp;" }}</small>
              </div>
            </div>
          </div>
          <div>
            <div>
              <label for="detalleTransaccion" class="block text-900 font-medium mb-2"> Detalle </label>
              <div class="flex flex-column">
                <v-textarea
                  placeholder="Detalle"
                  id="detalleTransaccion"
                  name="detalleTransaccion"
                  :class="{
                    'p-invalid': detalleEvents.detalleTransaccionError,
                  }"
                  :error="detalleEvents.detalleTransaccionError"
                  aria-describedby="text-error"
                  v-model="detalleEvents.detalleTransaccionValue"></v-textarea>
                <small id="text-error" class="p-error">{{ detalleTransaccionErrorMessage || "&nbsp;" }}</small>
              </div>
            </div>
          </div>
          <div class="flex flex-row">
            <div class="w-full mr-2">
              <label for="debeTransaccion" class="block text-900 font-medium mb-2"> Debe </label>
              <div class="flex flex-column">
                <v-inputnumber inputId="currency-us" mode="currency" currency="USD" locale="en-US" v-model="debeEvents.debeTransaccionValue" class="w-full" id="debeTransaccion" aria-describedby="text-error" name="debeTransaccion" :class="{ 'p-invalid': debeEvents.debeTransaccionError }" />
                <small id="text-error" class="p-error">{{ debeTransaccionErrorMessage || "&nbsp;" }}</small>
              </div>
            </div>
            <div class="w-full">
              <label for="haberTransaccion" class="block text-900 font-medium mb-2">Haber</label>
              <div class="flex flex-column">
                <v-inputnumber inputId="currency-us" mode="currency" currency="USD" locale="en-US" v-model="haberEvents.haberTransaccionValue" aria-describedby="text-error" id="haberTransaccion" name="haberTransaccion" class="w-full" :class="{ 'p-invalid': haberEvents.haberTransaccionError }" />
                <small id="text-error" class="p-error">{{ haberTransaccionErrorMessage || "&nbsp;" }}</small>
              </div>
            </div>
          </div>
          <div class="flex flex-row">
            <div class="w-full">
              <label for="referenciaTransaccion" class="block text-900 font-medium mb-2">Rerefencia</label>
              <div class="flex flex-column">
                <v-inputtext
                  id="referenciaTransaccion"
                  name="referenciaTransaccion"
                  class="w-full"
                  :class="{
                    'p-invalid': referenciaEvents.referenciaTransaccionError,
                  }"
                  aria-describedby="text-error"
                  v-model="referenciaEvents.referenciaTransaccionValue"></v-inputtext>
                <small id="text-error" class="p-error">{{ referenciaErrorMessage || "&nbsp;" }}</small>
              </div>
            </div>
            <div class="w-full ml-1">
              <label for="fechaTransaccion" class="block text-900 font-medium mb-2">Fecha</label>
              <div class="flex flex-column">
                <v-calendar
                  v-model="fechaTransaccionEvents.fechaTransaccionValue"
                  showIcon
                  dateFormat="yy-mm-dd"
                  id="fechaTransaccion"
                  name="fechaTransaccion"
                  class="w-full"
                  :class="{
                    'p-invalid': fechaTransaccionEvents.fechaTransaccionError,
                  }"
                  aria-describedby="text-error"
                  :error="fechaTransaccionEvents.fechaTransaccionError" />

                <small id="text-error" class="p-error">{{ fechaTransaccionErrorMessage || "&nbsp;" }}</small>
              </div>
            </div>
          </div>
        </form>
        <div class="w-full flex justify-content-evenly pl-2 pr-2 mt-4">
          <v-button type="submit" :label="accionTrans" @click="onSubmitTransaccion()"></v-button>
          <v-button label="Cancelar" severity="danger" @click="cancelarTransaction()"></v-button>
        </div>
      </v-dialog>
    </div>
  </v-panel>
</template>
<script lang="ts">
import { libro } from "@/models/libro";
import cuentasService from "@/services/cuentas.service";
import librosSevice from "@/services/libros.service";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { computed, defineComponent, reactive, ref } from "vue";
class cuentaAux {
  name = "";
  code = "";
}
class Transaction {
  daily_book_id_fk = "";
  codigo_chartaccount = "";
  detalle = "";
  debe = 0;
  haber = 0;
  referencia = "";
  fecha = "";
  estado = true;

  constructor(daily_book_id_fk: string, codigo_chartaccount: string, detalle: string, debe: number, haber: number, referencia: string, fecha: string, estado: boolean) {
    this.daily_book_id_fk = daily_book_id_fk;
    this.codigo_chartaccount = codigo_chartaccount;
    this.detalle = detalle;
    this.debe = debe;
    this.haber = haber;
    this.referencia = referencia;
    this.fecha = fecha;
    this.estado = estado;
  }
}

class TransactionAux {
  id: number;
  daily_book_id_fk = "";
  codigo_chartaccount = "";
  detalle = "";
  debe = 0;
  haber = 0;
  referencia = "";
  fecha = "";
  estado = true;

  constructor(id: number, daily_book_id_fk: string, codigo_chartaccount: string, detalle: string, debe: number, haber: number, referencia: string, fecha: string, estado: boolean) {
    this.id = id;
    this.daily_book_id_fk = daily_book_id_fk;
    this.codigo_chartaccount = codigo_chartaccount;
    this.detalle = detalle;
    this.debe = debe;
    this.haber = haber;
    this.referencia = referencia;
    this.fecha = fecha;
    this.estado = estado;
  }
}

export default defineComponent({
  setup() {
    let libros = ref<libro[]>([]);
    let accion = ref("");
    let temaError = ref("");
    let fechaLibroValue = ref(null);
    let fechaLibroError = ref("");
    let tituloValue = ref("");
    let tituloError = ref("");
    let daily_book_id_fkValue = ref("");
    const confirm = useConfirm();
    let transaccionList = ref<TransactionAux[]>([]);
    let book = ref<libro>(new libro("", "", "", ""));
    const toast = useToast();
    let details = ref([{}]);
    let mostrar = ref(false);
    let visible = ref(false);
    let libroDetail: [] = [];
    let id = ref(0);
    let dialogDetail = ref(false);
    let date = null;
    let dialogDeailInsert = ref(false);
    let libroItem = ref<libro>(new libro("", "", "", ""));
    let cuentas: cuentaAux = {
      name: "",
      code: "",
    };
    let listaCuentas: cuentaAux[] = [];
    const codigoEvents = reactive({
      codigoError: "",
      codigoValue: "",
    });
    let accionTrans = ref("Guardar");
    const onSubmitLibro = async () => {
      if (accion.value === "Guardar") {
        if (codigoEvents.codigoValue !== "" && temaEvents.temaValue !== "" && fechaEvents.fechaValue !== "" && tituloEvents.tituloValue !== "") {
          let fecha = new Date(fechaEvents.fechaValue);
          fecha.setDate(fecha.getDate());
          const fechaFormateada = fecha.toISOString().split("T")[0];
          let dateFormat = fechaFormateada;
          book.value = new libro(codigoEvents.codigoValue, temaEvents.temaValue, dateFormat, tituloEvents.tituloValue);
          await librosSevice.saveBook(new libro(codigoEvents.codigoValue, dateFormat, temaEvents.temaValue, tituloEvents.tituloValue));
          libros.value.push(new libro(codigoEvents.codigoValue, dateFormat, temaEvents.temaValue, tituloEvents.tituloValue));
          toast.add({
            severity: "success",
            summary: "Success Message",
            detail: "El libro se guardo correctamente",
            life: 3000,
          });
          dateFormat = "";
          limpiar();

          visible.value = false;
        } else {
          if (codigoEvents.codigoValue === "") {
            codigoEvents.codigoError = "Este campo es requerido";
          } else {
            codigoEvents.codigoError = "";
          }
          if (temaEvents.temaValue === "") {
            temaEvents.temaError = "Este campo es requerido";
          } else {
            temaEvents.temaError = "";
          }
          if (fechaEvents.fechaValue === "") {
            fechaEvents.fechaError = "Este campo es requerido";
          } else {
            fechaEvents.fechaError = "";
          }
          if (tituloEvents.tituloValue === "") {
            tituloEvents.tituloError = "Este campo es requerido";
          } else {
            tituloEvents.tituloError = "";
          }
        }
      } else {
        let fecha = new Date(fechaEvents.fechaValue);
        fecha.setDate(fecha.getDate());
        const fechaFormateada = fecha.toISOString().split("T")[0];
        let dateFormat = fechaFormateada;
        book.value = new libro(daily_book_id_fkValue.value, dateFormat, tituloEvents.tituloValue, temaEvents.temaValue);
        librosSevice.updateBook(book.value).then(() => {
          toast.add({
            severity: "success",
            summary: "Success Message",
            detail: "El libro se modificó correctamente",
            life: 3000,
          });
          limpiar();
          visible.value = false;
        });
      }
    };

    const limpiar = () => {
      codigoEvents.codigoValue = `libro_${libros.value.length}`;
      temaEvents.temaValue = "";
      tituloEvents.tituloValue = "";
    };

    const codigoErrorMessage = computed(() => {
      if (codigoEvents.codigoError !== "") {
        return codigoEvents.codigoError;
      } else return "";
    });

    const cancelar = () => {
      codigoEvents.codigoError = "";
      temaEvents.temaValue = "";
      temaEvents.temaError = "";
      fechaEvents.fechaValue = "";
      fechaEvents.fechaError = "";
      tituloEvents.tituloValue = "";
      tituloEvents.tituloError = "";
      visible.value = false;
    };

    const temaEvents = reactive({
      temaError: "",
      temaValue: "",
    });

    const temaErrorMessage = computed(() => {
      if (temaEvents.temaError !== "") {
        return temaEvents.temaError;
      } else return "";
    });

    const fechaEvents = reactive({
      fechaError: "",
      fechaValue: "",
    });

    const fechaErrorMessage = computed(() => {
      if (fechaEvents.fechaError !== "") {
        return fechaEvents.fechaError;
      } else return "";
    });

    const tituloEvents = reactive({
      tituloError: "",
      tituloValue: "",
    });

    const tituloErrorMessage = computed(() => {
      if (tituloEvents.tituloError !== "") {
        return tituloEvents.tituloError;
      } else return "";
    });

    const referenciaEvents = reactive({
      referenciaTransaccionError: "",
      referenciaTransaccionValue: "",
    });
    const referenciaErrorMessage = computed(() => {
      if (referenciaEvents.referenciaTransaccionError !== "") {
        return referenciaEvents.referenciaTransaccionError;
      } else return "";
    });

    const haberEvents = reactive({
      haberTransaccionValue: 0,
      haberTransaccionError: "",
    });

    const haberTransaccionErrorMessage = computed(() => {
      if (haberEvents.haberTransaccionError !== "") {
        return haberEvents.haberTransaccionError;
      } else return "";
    });

    const debeEvents = reactive({
      debeTransaccionValue: 0,
      debeTransaccionError: "",
    });

    const debeTransaccionErrorMessage = computed(() => {
      if (debeEvents.debeTransaccionError !== "") {
        return debeEvents.debeTransaccionError;
      } else return "";
    });

    const detalleEvents = reactive({
      detalleTransaccionValue: "",
      detalleTransaccionError: "",
    });

    const detalleTransaccionErrorMessage = computed(() => {
      if (detalleEvents.detalleTransaccionError !== "") {
        return detalleEvents.detalleTransaccionError;
      } else return "";
    });

    const cuentaEvent = reactive({
      cuentaValue: { name: "", code: "" },
      cuentaError: "",
    });
    const cuentaErroMessage = computed(() => {
      if (cuentaEvent.cuentaError !== "") {
        return cuentaEvent.cuentaError;
      } else return "";
    });

    const fechaTransaccionEvents = reactive({
      fechaTransaccionError: "",
      fechaTransaccionValue: "",
    });

    const fechaTransaccionErrorMessage = computed(() => {
      if (fechaTransaccionEvents.fechaTransaccionError !== "") {
        return fechaTransaccionEvents.fechaTransaccionError;
      } else return "";
    });

    const onSubmitTransaccion = () => {
      if (accionTrans.value === "Guardar") {
        if (daily_book_id_fkValue.value !== "" && cuentaEvent.cuentaValue.code !== "" && detalleEvents.detalleTransaccionValue !== "" && referenciaEvents.referenciaTransaccionValue !== "" && fechaTransaccionEvents.fechaTransaccionValue !== "") {
          let fecha = new Date(fechaTransaccionEvents.fechaTransaccionValue);
          fecha.setDate(fecha.getDate());
          const fechaFormateada = fecha.toISOString().split("T")[0];
          let dateFormat = fechaFormateada;
          let index = transaccionList.value.length;
          transaccionList.value.push(new TransactionAux(index, daily_book_id_fkValue.value, cuentaEvent.cuentaValue.code, detalleEvents.detalleTransaccionValue, debeEvents.debeTransaccionValue, haberEvents.haberTransaccionValue, referenciaEvents.referenciaTransaccionValue, dateFormat, true));
          toast.add({
            severity: "success",
            summary: "Success Message",
            detail: "Transacción agregada",
            life: 3000,
          });

          limpiarForm();
        } else {
          if (cuentaEvent.cuentaValue.code === "") {
            cuentaEvent.cuentaError = "Este campo es requerido";
          } else {
            cuentaEvent.cuentaError = "";
          }
          if (detalleEvents.detalleTransaccionValue === "") {
            detalleEvents.detalleTransaccionError = "Este campo es requerido";
          } else {
            detalleEvents.detalleTransaccionError = "";
          }
          if (referenciaEvents.referenciaTransaccionValue === "") {
            referenciaEvents.referenciaTransaccionError = "Este campo es requerido";
          } else {
            referenciaEvents.referenciaTransaccionError = "";
          }
          if (fechaTransaccionEvents.fechaTransaccionValue === "") {
            fechaTransaccionEvents.fechaTransaccionError = "Este campo es requerido";
          } else {
            fechaTransaccionEvents.fechaTransaccionError = "";
          }
        }
      } else if (accionTrans.value === "Editar") {
        if (daily_book_id_fkValue.value !== "" && cuentaEvent.cuentaValue.code !== "" && detalleEvents.detalleTransaccionValue !== "" && referenciaEvents.referenciaTransaccionValue !== "" && fechaTransaccionEvents.fechaTransaccionValue !== "") {
          let fecha = new Date(fechaTransaccionEvents.fechaTransaccionValue);
          fecha.setDate(fecha.getDate());
          const fechaFormateada = fecha.toISOString().split("T")[0];
          let dateFormat = fechaFormateada;
          let index = transaccionList.value.length;
          let tran = new Transaction(daily_book_id_fkValue.value, cuentaEvent.cuentaValue.code, detalleEvents.detalleTransaccionValue, debeEvents.debeTransaccionValue, haberEvents.haberTransaccionValue, referenciaEvents.referenciaTransaccionValue, dateFormat, true);

          librosSevice.updateDetails(tran, id.value).then((res: any) => {
            let index = details.value.indexOf((cuenta: any) => cuenta.id === id.value);
            details.value.splice(index, 1, tran);
            toast.add({
              severity: "info",
              summary: "Confirmar",
              detail: "Transacción actualizada",
              life: 3000,
            });
          });
          toast.add({
            severity: "success",
            summary: "Success Message",
            detail: "Transacción editada correctamente",
            life: 3000,
          });

          limpiarForm();
        } else {
          if (cuentaEvent.cuentaValue.code === "") {
            cuentaEvent.cuentaError = "Este campo es requerido";
          } else {
            cuentaEvent.cuentaError = "";
          }
          if (detalleEvents.detalleTransaccionValue === "") {
            detalleEvents.detalleTransaccionError = "Este campo es requerido";
          } else {
            detalleEvents.detalleTransaccionError = "";
          }
          if (referenciaEvents.referenciaTransaccionValue === "") {
            referenciaEvents.referenciaTransaccionError = "Este campo es requerido";
          } else {
            referenciaEvents.referenciaTransaccionError = "";
          }
          if (fechaTransaccionEvents.fechaTransaccionValue === "") {
            fechaTransaccionEvents.fechaTransaccionError = "Este campo es requerido";
          } else {
            fechaTransaccionEvents.fechaTransaccionError = "";
          }
        }
      } else if (accionTrans.value === "Editar Transacción") {
        if (daily_book_id_fkValue.value !== "" && cuentaEvent.cuentaValue.code !== "" && detalleEvents.detalleTransaccionValue !== "" && referenciaEvents.referenciaTransaccionValue !== "" && fechaTransaccionEvents.fechaTransaccionValue !== "") {
          let fecha = new Date(fechaTransaccionEvents.fechaTransaccionValue);
          fecha.setDate(fecha.getDate());
          const fechaFormateada = fecha.toISOString().split("T")[0];
          let dateFormat = fechaFormateada;
          console.log(daily_book_id_fkValue.value);
          let index = transaccionList.value.findIndex((trans: any) => trans.id === id.value);
          transaccionList.value.splice(index, 1, new TransactionAux(id.value, daily_book_id_fkValue.value, cuentaEvent.cuentaValue.code, detalleEvents.detalleTransaccionValue, debeEvents.debeTransaccionValue, haberEvents.haberTransaccionValue, referenciaEvents.referenciaTransaccionValue, dateFormat, true));
          toast.add({
            severity: "success",
            summary: "Success Message",
            detail: "Transacción agregada",
            life: 3000,
          });

          limpiarForm();
        } else {
          if (cuentaEvent.cuentaValue.code === "") {
            cuentaEvent.cuentaError = "Este campo es requerido";
          } else {
            cuentaEvent.cuentaError = "";
          }
          if (detalleEvents.detalleTransaccionValue === "") {
            detalleEvents.detalleTransaccionError = "Este campo es requerido";
          } else {
            detalleEvents.detalleTransaccionError = "";
          }
          if (referenciaEvents.referenciaTransaccionValue === "") {
            referenciaEvents.referenciaTransaccionError = "Este campo es requerido";
          } else {
            referenciaEvents.referenciaTransaccionError = "";
          }
          if (fechaTransaccionEvents.fechaTransaccionValue === "") {
            fechaTransaccionEvents.fechaTransaccionError = "Este campo es requerido";
          } else {
            fechaTransaccionEvents.fechaTransaccionError = "";
          }
        }
      }
    };
    const limpiarForm = () => {
      cuentaEvent.cuentaValue = { name: "", code: "" };
      detalleEvents.detalleTransaccionValue = "";
      haberEvents.haberTransaccionValue = 0;
      debeEvents.debeTransaccionValue = 0;
      fechaTransaccionEvents.fechaTransaccionValue = "";
      listaCuentas = [];
    };
    const cancelarTransaction = () => {
      limpiarForm();
      dialogDeailInsert.value = false;
    };

    const guardarDetail = () => {
      if (transaccionList.value.length > 0) {
        librosSevice
          .saveTransaccion(transaccionList.value)
          .then(() => {
            toast.add({
              severity: "success",
              summary: "Success Message",
              detail: "Se guardaros las transacciones correctamente",
              life: 3000,
            });
            dialogDetail.value = false;
            transaccionList.value.forEach((elem: any) => {
              details.value.push(new Transaction(elem.daily_book_id_fk, elem.codigo_chartaccount, elem.detalle, elem.debe, elem.haber, elem.referencia, elem.fecha, elem.estado));
            });
            transaccionList.value = [];
          })
          .catch(() => {
            toast.add({
              severity: "error",
              summary: "Error",
              detail: "Ocurrio un error, revisar las transacciones",
              life: 3000,
            });
          });
      } else {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "No ha ingresado transacciones",
          life: 3000,
        });
      }
    };

    const deleteDetail = (data: any) => {
      confirm.require({
        message: "Desea eliminar este Cuenta?",
        header: "Confirmar",
        icon: "pi pi-info-circle",
        rejectClass: "p-button-text p-button-text",
        acceptClass: "p-button-danger p-button-text",
        accept: () => {
          librosSevice.deleteDetailAccount(data.id).then((res: any) => {
            let index = details.value.indexOf((cuenta: any) => cuenta.id === data.codigo);
            details.value.splice(index, 1);
            toast.add({
              severity: "info",
              summary: "Confirmar",
              detail: "Transacción eliminada",
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
    const editBook = () => {
      accion.value = "Editar";
      visible.value = true;
    };
    const eliminarLibro = () => {
      confirm.require({
        message: "Desea eliminar este Libro?",
        header: "Confirmar",
        icon: "pi pi-info-circle",
        rejectClass: "p-button-text p-button-text",
        acceptClass: "p-button-danger p-button-text",
        accept: () => {
          librosSevice.deleteBook(daily_book_id_fkValue.value).then(() => {
            toast.add({
              severity: "info",
              summary: "Confirmar",
              detail: "Libro eliminado",
              life: 3000,
            });
          });
          let index = libros.value.findIndex((libro: any) => libro.daily_book_id === daily_book_id_fkValue.value);
          libros.value.splice(index,1);
          mostrar.value = false;
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
    const editTransaccionList = (item: any) => {
      accionTrans.value = "Editar Transacción";
      cuentaEvent.cuentaValue = {
        name: item.codigo_chartaccount,
        code: item.codigo_chartaccount,
      };
      id.value = item.id;
      detalleEvents.detalleTransaccionValue = item.detalle;
      haberEvents.haberTransaccionValue = item.haber;
      debeEvents.debeTransaccionValue = item.debe;
      fechaTransaccionEvents.fechaTransaccionValue = item.fecha;
      referenciaEvents.referenciaTransaccionValue = item.referencia;
      daily_book_id_fkValue.value = item.daily_book_id_fk;
      dialogDeailInsert.value = true;
    };
    const eliminarTransaccionList = (item: TransactionAux) => {
      confirm.require({
        message: "Desea eliminar este Cuenta?",
        header: "Confirmar",
        icon: "pi pi-info-circle",
        rejectClass: "p-button-text p-button-text",
        acceptClass: "p-button-danger p-button-text",
        accept: () => {
          let index = transaccionList.value.findIndex((transaccion: TransactionAux) => transaccion.id === item.id);
          transaccionList.value.splice(index, 1);
          toast.add({
            severity: "info",
            summary: "Confirmar",
            detail: "Transacción eliminada",
            life: 3000,
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
    return {
      eliminarTransaccionList,
      fechaTransaccionEvents,
      fechaTransaccionErrorMessage,
      guardarDetail,
      onSubmitTransaccion,
      cuentaEvent,
      cuentaErroMessage,
      detalleEvents,
      detalleTransaccionErrorMessage,
      debeEvents,
      debeTransaccionErrorMessage,
      haberTransaccionErrorMessage,
      haberEvents,
      referenciaEvents,
      referenciaErrorMessage,
      cancelar,
      temaErrorMessage,
      tituloEvents,
      tituloErrorMessage,
      temaEvents,
      fechaErrorMessage,
      temaError,
      fechaEvents,
      codigoEvents,
      fechaLibroValue,
      fechaLibroError,
      tituloValue,
      tituloError,
      daily_book_id_fkValue,
      codigoErrorMessage,
      onSubmitLibro,
      libros,
      details,
      mostrar,
      visible,
      libroDetail,
      dialogDetail,
      date,
      dialogDeailInsert,
      libroItem,
      cuentas,
      listaCuentas,
      transaccionList,
      cancelarTransaction,
      deleteDetail,
      editBook,
      accion,
      eliminarLibro,
      editTransaccionList,
      accionTrans,
      id,
    };
  },
  methods: {
    async fillDropDown() {
      this.listaCuentas = [];
      await cuentasService.getAccount().then((response) => {
        response.data.forEach((element: any) => {
          if (element.estado === "ACTIVO") {
            this.cuentas = {
              name: `${element.codigo} - ${element.titulo}`,
              code: element.codigo,
            };
            this.listaCuentas.push(this.cuentas);
          }
        });
      });
    },
    async getBooks() {
      await librosSevice.getBooks().then((response) => {
        this.libros = response.data;
        this.codigoEvents.codigoValue = `libro_${this.libros.length}`;
      });
    },
    openDialogDetail() {
      this.detalleEvents.detalleTransaccionValue = "";
      this.haberEvents.haberTransaccionValue = 0;
      this.debeEvents.debeTransaccionValue = 0;
      this.fechaTransaccionEvents.fechaTransaccionValue = "";
      this.referenciaEvents.referenciaTransaccionValue = "";
      this.daily_book_id_fkValue = "";
      this.dialogDetail = true;
    },
    async getItem(item: libro) {
      this.libroItem = item;
      this.temaEvents.temaValue = item.tema;
      this.fechaEvents.fechaValue = item.fecha;
      this.tituloEvents.tituloValue = item.titulo;
      this.daily_book_id_fkValue = item.daily_book_id;
      await librosSevice
        .getBooksDetails(item.daily_book_id)
        .then((response) => {
          this.details = response.data;
          this.mostrar = true;
        })
        .catch((err) => console.log(err));
    },
    backToItems() {
      this.codigoEvents.codigoError = "";
      this.temaEvents.temaValue = "";
      this.temaEvents.temaError = "";
      this.fechaEvents.fechaValue = "";
      this.fechaEvents.fechaError = "";
      this.tituloEvents.tituloValue = "";
      this.tituloEvents.tituloError = "";
      this.libros = [];
      this.mostrar = false;
      this.getBooks();
    },
    abrirDialogLibro() {
      this.cuentaEvent.cuentaValue = { name: "", code: "" };
      this.detalleEvents.detalleTransaccionValue = "";
      this.haberEvents.haberTransaccionValue = 0;
      this.debeEvents.debeTransaccionValue = 0;
      this.fechaTransaccionEvents.fechaTransaccionValue = "";
      this.listaCuentas = [];
      this.accion = "Guardar";
      this.visible = true;
    },
    openDialogDetailInsert() {
      this.accionTrans = "Guardar";
      this.dialogDeailInsert = true;
      this.daily_book_id_fkValue = this.libroItem.daily_book_id;
      this.fillDropDown();
    },
    async editTransaccion(item: any) {
      this.accionTrans = "Editar";
      await this.fillDropDown();
      this.id = item.id;
      this.cuentaEvent.cuentaValue = {
        name: item.codigo_chartaccount,
        code: item.codigo_chartaccount,
      };
      this.detalleEvents.detalleTransaccionValue = item.detalle;
      this.haberEvents.haberTransaccionValue = item.haber;
      this.debeEvents.debeTransaccionValue = item.debe;
      this.fechaTransaccionEvents.fechaTransaccionValue = item.fecha;
      this.referenciaEvents.referenciaTransaccionValue = item.referencia;
      this.daily_book_id_fkValue = item.daily_book_id_fk;
      this.dialogDeailInsert = true;
    },
  },
  mounted() {
    this.getBooks();
  },
});
</script>
<style>
.p-card-header {
  text-align: center !important;
  padding-top: 1.5rem;
}
.p-card-content {
  text-align: center !important;
  font: 1.3em sans-serif;
  height: 100% !important;
}
.p-panel-content {
  background: #f3f3f3;
}
.p-panel-icons {
  height: 16px !important;
}
.p-dialog-header {
  display: flex;
  justify-content: end;
}
.p-inputnumber-input {
  width: 7rem;
}
</style>
