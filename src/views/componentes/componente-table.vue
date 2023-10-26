<template>
  <v-panel toggleable :header="`cuenta: ${codigoPanel}`">
    <div>
      <v-datatable-table
        :value="mayorizacionList"
        paginator
        :rows="6"
        class="p-datatable-sm"
      >
        <v-datatable-column field="fecha" header="Fecha"></v-datatable-column>
        <v-datatable-column
          field="detalle"
          header="Detallo"
        ></v-datatable-column>
        <v-datatable-column
          field="referencia"
          header="Referencia"
        ></v-datatable-column>
        <v-datatable-column field="debe" header="Debito"></v-datatable-column>
        <v-datatable-column field="haber" header="Credito"></v-datatable-column>
      </v-datatable-table>
    </div>
  </v-panel>
</template>

<script lang="ts">
import librosService from "@/services/libros.service";
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  props: {
    idLibro: { type: String, required: true },
    codigo: { type: String, required: true },
  },
  setup(props: any) {
    let mayorizacionList = ref([{}]);
    let acreedor = ref(0);
    let saldoMayorizacion = ref(0);
    let deudor = ref(0);
    let codigoPanel = ref({});
    const getBooks = (libro: string, cod: string) => {
      librosService.getBooksByIdAndCuenta(libro, cod).then((response: any) => {
        // for (let index = 0; index < respuesta.length; index++) {
        //   if (respuesta[index].debe > 0 && respuesta[index].haber == 0) {
        //     credito = credito + parseFloat(respuesta[index].debe);
        //   } else if (
        //     respuesta[index].debe == 0 &&
        //     respuesta[index].haber > 0 &&
        //     credito == 0
        //   ) {
        //     acreedor = acreedor + parseFloat(respuesta[index].haber);
        //   } else if (credito > 0 && respuesta[index].haber > 0) {
        //     credito = credito - parseFloat(respuesta[index].haber);
        //   }
        //   console.log(credito, acreedor);
        //   let mayor = {
        //     codigo_chartaccount: respuesta[index].codigo_chartaccount,
        //     daily_book_id_fk: respuesta[index].daily_book_id_fk,
        //     debe: respuesta[index].debe,
        //     detalle: respuesta[index].detalle,
        //     fecha: respuesta[index].fecha,
        //     haber: respuesta[index].haber,
        //     id: respuesta[index].id,
        //     referencia: respuesta[index].referencia,
        //     creedito: credito,
        //     acreedor: acreedor,
        //   };
        //   mayorizacionList.value.push(mayor);
        // }
        mayorizacionList.value = response.data;
        response.data.forEach((movimiento: any) => {
          saldoMayorizacion.value += movimiento.debito - movimiento.credito;
        });

        if (saldoMayorizacion.value > 0) {
          deudor.value = saldoMayorizacion.value;
        } else if (saldoMayorizacion.value < 0) {
          acreedor.value = saldoMayorizacion.value;
        } else {
          deudor.value = 0;
          acreedor.value = 0;
        }
        let mayor = {
          codigo_chartaccount: "",
          daily_book_id_fk: "",
          debe: deudor.value,
          detalle: "Resultado",
          fecha: "",
          haber: acreedor.value,
          id: "",
          referencia: "",
        };
        librosService.updateBooksDetails(libro, cod, true).then((response) => {
          console.log(response);
        });
        let mayorizacion = {
          daily_book_id_fk: libro,
          codigo_chartAccount: props.codigo,
          referencia: response.data[0].referencia,
          deudor: deudor.value,
          acreedor: acreedor.value,
        };
        librosService.saveMayorizacion(mayorizacion);
        mayorizacionList.value.push(mayor);
      });

      codigoPanel.value = props.codigo;
    };
    onMounted(() => {
      getBooks(props.idLibro, props.codigo);
    });
    return {
      mayorizacionList,
      getBooks,
      codigoPanel,
      acreedor,
      deudor,
    };
  },
});
</script>
