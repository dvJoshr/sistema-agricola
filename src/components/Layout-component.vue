<template>
  <div class="h-full m-2 bg-white border-round-md pb-1">
    <TopMenu />
    <div class="">
      <SideBar class="static" />
      <div class="absolute m-2 pt-2 layout-content app-layout__page">
        <router-view />
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
