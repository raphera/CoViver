<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CleanLayout'
});
</script>

<style scoped>
.q-layout {
  background: #f5f5f5;
  /* substitua por sua cor de fundo preferida */
}
</style>
