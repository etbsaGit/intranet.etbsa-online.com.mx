<template>
  <q-list bordered separator dense style="border-radius: 10px">
    <!-- Encabezado -->
    <q-item align="center">
      <q-item-section
        v-for="(col, index) in headers"
        :key="'header-' + index"
        :avatar="col.avatar"
      >
        <q-item-label>
          <strong>{{ col.label }}</strong>
        </q-item-label>
      </q-item-section>
    </q-item>

    <!-- Filas -->
    <q-item
      align="center"
      v-for="(item, index) in items"
      :key="index"
      :class="getRowClass(item)"
    >
      <q-item-section
        v-for="(col, i) in headers"
        :key="'cell-' + index + '-' + i"
        :avatar="col.avatar"
      >
        <template v-if="col.slot && $slots[col.slot]">
          <slot :name="col.slot" :item="item" />
        </template>
        <template v-else>
          {{ getNestedValue(item, col.key) }}
        </template>
      </q-item-section>
    </q-item>

    <!-- Botón agregar -->
    <q-item v-if="labelAdd && onAdd">
      <q-item-section>
        <q-btn
          dense
          flat
          :label="labelAdd"
          color="primary"
          icon="add_circle"
          @click="onAdd"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
  onAdd: Function,
  labelAdd: {
    type: String,
    default: "",
  },
  rowHighlightFn: {
    type: Function,
    default: () => "",
  },
});

const getNestedValue = (obj, path) => {
  return path?.split(".").reduce((o, p) => (o ? o[p] : ""), obj);
};

const getRowClass = (item) => {
  return props.rowHighlightFn(item);
};
</script>
