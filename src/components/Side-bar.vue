<template>
  <div class="responsive-menu m-2 flex justify-content-center p-2 shadow-7">
    <v-menu :model="items" class="w-full h-full pt-3">
      <template #item="{ label, item }">
        <router-link :to="{ name: item.url }" class="p-menuitem-link">{{
          label
        }}</router-link>
      </template>
    </v-menu>
  </div>
</template>
<script lang="ts">
import { ref } from "vue";

export default {
  name: "Side-bar",
  setup() {
    const items = ref([
      {
        label: "Cuentas contables",
        icon: "pi pi-fw pi-plus",
        url: "cuentas",
      },
      {
        label: "Libro diario",
        icon: "pi pi-fw pi-trash",
        url: "libro-diario",
      },
      { label: "Mayorización", icon: "pi pi-fw pi-trash", url: "mayorizacion" },
      {
        label: "Libro diario",
        icon: "pi pi-fw pi-trash",
      },
    ]);
    return { items };
  },
};
</script>
<style>
.responsive-menu {
  height: calc(100vh - 5.4rem);
  width: 230px;
}
</style>
