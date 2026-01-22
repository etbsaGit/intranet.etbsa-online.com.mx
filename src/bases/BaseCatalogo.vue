<template>
  <q-item class="catalogo-wrap">
    <q-item-section>
      <TableSkeleton v-if="crud.loading" :rows="10" />

      <q-table
        v-else
        class="catalogo-table"
        flat
        bordered
        :title="title"
        :rows="crud.paginatedItems"
        :columns="columns"
        :row-key="rowKey"
        hide-pagination
        :dense="$q.screen.lt.md"
        :rows-per-page-options="[0]"
        :loading="crud.loading"
      >
        <!-- TOP BAR -->
        <template v-slot:top-right>
          <div class="catalogo-top">
            <div class="catalogo-actions">
              <q-input
                dense
                outlined
                clearable
                v-model="filters.search"
                placeholder="Buscar..."
                debounce="1000"
                class="catalogo-search"
                @update:model-value="onSearchChange"
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <!-- ✅ SLOT OPCIONAL: si el padre no lo manda, no se renderiza -->
              <slot
                name="filters-extra"
                v-bind="{
                  filters,
                  reload,
                  onSearchChange,
                }"
              />

              <q-btn
                unelevated
                color="primary"
                icon="add"
                class="catalogo-create"
                @click="openCreate"
              >
                <q-tooltip
                  class="bg-primary text-body2"
                  transition-show="rotate"
                  transition-hide="rotate"
                  anchor="center left"
                  self="center right"
                  :offset="[10, 10]"
                >
                  {{ createLabel }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>

        <!-- ACTIONS -->
        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="row no-wrap items-center q-gutter-xs">
              <q-btn
                round
                dense
                flat
                icon="edit"
                color="blue"
                @click="openEdit(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>

              <q-btn
                v-if="$props.onDelete"
                round
                dense
                flat
                icon="delete"
                color="red"
                @click="openDelete(props.row)"
              >
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <!-- PASSTHROUGH SLOTS -->
        <template
          v-for="name in tableSlotNames"
          :key="name"
          v-slot:[name]="slotProps"
        >
          <slot :name="name" v-bind="slotProps" />
        </template>

        <template v-slot:bottom>
          <BasePagination
            v-if="crud.pagination.lastPage > 1"
            :pagination="crud.pagination"
            @update:currentPage="changePage"
          />
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <BaseDialog
    :maximized="props.Maximized"
    :fullHeight="props.FullHeight"
    :fullWidth="props.FullWidth"
    v-model="showAdd"
    mode="create"
    @submit="handleCreate"
  >
    <template #form><slot name="create-form" /></template>
  </BaseDialog>

  <BaseDialog
    :maximized="props.Maximized"
    :fullHeight="props.FullHeight"
    :fullWidth="props.FullWidth"
    v-model="showEdit"
    mode="edit"
    @submit="handleUpdate"
  >
    <template #form><slot name="edit-form" :item="selected" /></template>
  </BaseDialog>

  <BaseDialog v-model="showDelete" mode="delete" @submit="handleDelete">
    <template #delete-message>
      ¿Estás seguro que deseas eliminar este elemento?
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, computed, useSlots, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";
import BaseDialog from "src/bases/BaseDialog.vue";
import TableSkeleton from "src/bases/skeletons/TableSkeleton.vue";
import BasePagination from "src/bases/BasePagination.vue";

const props = defineProps({
  title: String,
  columns: { type: Array, required: true },
  rowKey: { type: String, default: "id" },
  createLabel: { type: String, default: "Nuevo registro" },
  url: { type: String, required: true },
  initialFilters: { type: Object, default: () => ({}) },
  filters: { type: Object, default: () => ({}) },
  onCreate: { type: Function, required: true },
  onUpdate: { type: Function, required: true },
  // ÚNICO PROP PARA CREATE Y EDIT
  Maximized: { type: [Boolean, null], default: false },
  FullHeight: { type: [Boolean, null], default: false },
  FullWidth: { type: [Boolean, null], default: false },
  onDelete: { type: [Boolean, null], default: true },
});

const emit = defineEmits(["delete"]);
const crud = useCrudStore();
const slots = useSlots();

const showAdd = ref(false);
const showEdit = ref(false);
const showDelete = ref(false);
const selected = ref(null);

const filters = ref({
  search: "",
  ...props.initialFilters,
});

const tableSlotNames = computed(() => {
  const colNames = new Set(
    (props.columns || []).map((c) => `body-cell-${c.name}`)
  );

  return Object.entries(slots)
    .filter(([name, fn]) => {
      const isTable =
        name.startsWith("header-cell-") ||
        name.startsWith("body-") ||
        name.startsWith("top-");

      if (!isTable || name === "body-cell-actions") return false;
      if (name.startsWith("body-cell-") && !colNames.has(name)) return false;

      return typeof fn === "function";
    })
    .map(([name]) => name);
});

const openCreate = () => {
  selected.value = null;
  showAdd.value = true;
};

const openEdit = (row) => {
  selected.value = row;
  showEdit.value = true;
};

const openDelete = (row) => {
  selected.value = row;
  showDelete.value = true;
};

const buildPayload = (page = 1) => ({
  ...filters.value,
  page,
});

const reload = async (page = 1) => {
  await crud.getPaginatedItems(props.url, buildPayload(page));
};

const changePage = async (page) => {
  await reload(page);
};

const onSearchChange = async () => {
  await reload(1);
};

const handleCreate = async () => {
  const ok = await props.onCreate();
  if (!ok) return;
  showAdd.value = false;
  await reload(crud.pagination.currentPage);
};

const handleUpdate = async () => {
  const ok = await props.onUpdate(selected.value);
  if (!ok) return;
  showEdit.value = false;
  await reload(crud.pagination.currentPage);
};

const handleDelete = async () => {
  emit("delete", selected.value);
  showDelete.value = false;
  await reload(crud.pagination.currentPage);
};

onMounted(() => {
  reload(1);
});
</script>

<style scoped>
.catalogo-wrap {
  padding: 6px;
}

.catalogo-table {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.08);
}

/* TOP */
.catalogo-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.02), transparent);
}

.catalogo-title {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.2px;
}

.catalogo-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.catalogo-search {
  width: min(340px, 52vw);
}

.catalogo-create {
  border-radius: 10px;
}

/* TABLE: hover + stripes suaves */
:deep(.q-table tbody tr:hover) {
  background: rgba(0, 0, 0, 0.03);
}

:deep(.q-table tbody tr:nth-child(odd)) {
  background: rgba(0, 0, 0, 0.015);
}

/* Header más “premium” */
:deep(.q-table thead tr th) {
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  background: #fff;
}

/* Celdas */
:deep(.q-table tbody td) {
  font-size: 13px;
}
</style>
