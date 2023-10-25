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
        <v-datatable-column
          field="creedito"
          header="Deudor"
        ></v-datatable-column>
        <v-datatable-column
          field="acreedor"
          header="Acreedor"
        ></v-datatable-column>
      </v-datatable-table>
    </div>
  </v-panel>
</template>

<script lang="ts">
import listaLibros from "@/services/libros.service";
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  props: {
    idLibro: { type: String, required: true },
    codigo: { type: String, required: true },
  },
  setup(props: any) {
    let mayorizacionList = ref([{}]);
    let codigoPanel = ref({});
    const getBooks = (libro: string, cod: string) => {
      console.log(props.idLibro);
      listaLibros.getBooksByIdAndCuenta(libro, cod).then((response) => {
        let respuesta = response.data;
        let credito = 0;
        let acreedor = 0;
        for (let index = 0; index < respuesta.length; index++) {
          if (respuesta[index].debe > 0 && respuesta[index].haber == 0) {
            credito = credito + parseFloat(respuesta[index].debe);
          } else if (
            respuesta[index].debe == 0 &&
            respuesta[index].haber > 0 &&
            credito == 0
          ) {
            acreedor = acreedor + parseFloat(respuesta[index].haber);
          } else if (credito > 0 && respuesta[index].haber > 0) {
            credito = credito - parseFloat(respuesta[index].haber);
          }
          console.log(credito, acreedor);
          let mayor = {
            codigo_chartaccount: respuesta[index].codigo_chartaccount,
            daily_book_id_fk: respuesta[index].daily_book_id_fk,
            debe: respuesta[index].debe,
            detalle: respuesta[index].detalle,
            fecha: respuesta[index].fecha,
            haber: respuesta[index].haber,
            id: respuesta[index].id,
            referencia: respuesta[index].referencia,
            creedito: credito,
            acreedor: acreedor,
          };
          mayorizacionList.value.push(mayor);
        }
      });
      codigoPanel.value = props.codigo;
      console.log(mayorizacionList);
    };
    onMounted(() => {
      getBooks(props.idLibro, props.codigo);
    });
    return {
      mayorizacionList,
      getBooks,
      codigoPanel,
    };
  },
});
</script>
