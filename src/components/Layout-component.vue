<template>
  <div class="h-full bg-white border-round-md pb-1">
    <TopMenu />
    <div class="overflow: hidden;">
      <div class="flex relative lg:static surface-ground">
        <SideBar />
        <div class="flex flex-column relative flex-auto m-2">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SideBar from "./Side-bar.vue";
import TopMenu from "./Top-menu.vue";
export default {
  name: "LayoutComponent",
  components: {
    TopMenu,
    SideBar,
  },
};
</script>

<style>
.layout-content {
  top: 3.7rem !important;
  margin-left: 245px !important;
  width: calc(100% - 269px);
}
</style>
