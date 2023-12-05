<template>
  <div
    class="mt-2 ml-2 surface-section h-screen hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none"
    style="width: 280px; height: calc(100vh - 4.5rem) !important"
  >
    <div class="flex flex-column">
      <div class="overflow-y-auto">
        <v-menu :model="items" class="list-none w-full p-3 m-0">
          <template #item="{ label, item }">
            <router-link :to="{ name: item.url }" class="p-menuitem-link">
              <i :class="`${item.icon} mr-2`"></i>
              <span class="">{{ label }}</span></router-link
            >
          </template>
        </v-menu>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref } from "vue";

export default {
  name: "Side-bar",
  setup() {
    const items = ref([
      {
        label: "Cuentas ",
        icon: "pi pi-bars",
        url: "cuentas",
      },
      {
        label: "Libro ",
        icon: "pi pi-book",
        url: "libro-diario",
      },
      { label: "Mayorización", icon: "pi pi-calculator", url: "mayorizacion" },
      {
        label: "Estados ",
        icon: "pi pi-money-bill",
        url: "estados-financieros",
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
.menu-item-link {
  font-weight: 500 !important;
}
</style>
