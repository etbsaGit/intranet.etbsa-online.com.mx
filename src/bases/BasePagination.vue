<script setup>
import { QPagination, QSpace } from "quasar";

const props = defineProps({
  // La prop pagination viene del padre, contiene currentPage y lastPage
  pagination: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:currentPage"]);
</script>

<template>
  <q-space />
  <td>
    <q-pagination
      color="primary"
      :model-value="pagination.currentPage"
      :max="pagination.lastPage"
      :max-pages="6"
      direction-links
      boundary-links
      gutter="10px"
      icon-first="skip_previous"
      icon-last="skip_next"
      icon-prev="fast_rewind"
      icon-next="fast_forward"
      @update:model-value="(val) => emit('update:currentPage', val)"
    />
  </td>
  <q-space />
</template>
