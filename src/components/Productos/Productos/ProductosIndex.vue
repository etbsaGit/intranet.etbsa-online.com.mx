<template>
  <BaseCatalogo title="Productos" :columns="columns" url="/api/intranet/products" :on-create="createItem"
    :on-update="updateItem" :on-delete="true" @delete="destroyItem" :initialFilters="{ category_id: null }">
    <template #create-form>
      <productos-form ref="add" />
    </template>

    <template #edit-form="{ item }">
      <productos-form ref="edit" :producto="item" />
    </template>

    <!-- ícono activo -->
    <template #body-cell-activo="props">
      <q-td :props="props">
        <q-icon :name="props.row.active == 1 ? 'check_circle' : 'cancel'"
          :color="props.row.active == 1 ? 'positive' : 'grey'" size="md">
          <q-tooltip>
            {{ props.row.active == 1 ? 'Activo' : 'Inactivo' }}
          </q-tooltip>
        </q-icon>
      </q-td>
    </template>
    <!-- ícono usado -->
    <template #body-cell-usado="props">
      <q-td :props="props">
        <q-icon :name="props.row.is_usado == 1 ? 'check_circle' : 'cancel'"
          :color="props.row.is_usado == 1 ? 'positive' : 'grey'" size="md">
          <q-tooltip>
            {{ props.row.is_usado == 1 ? 'Activo' : 'Inactivo' }}
          </q-tooltip>
        </q-icon>
      </q-td>
    </template>

  </BaseCatalogo>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";
import { sendRequest } from "src/boot/functions";

import BaseCatalogo from "src/bases/BaseCatalogo.vue";
import SubCategoriasForm from "src/components/Productos/Categorias/SubCategoriasForm.vue";
import ProductosForm from "src/components/Productos/Productos/ProductosForm.vue";

const crudStore = useCrudStore();

const add = ref(null);
const edit = ref(null);

const BASE_URL = "/api/intranet/product";

const columns = [
  {
    name: "actions",
    align: "left",
    field: "actions",
  },
  {
    name: "name",
    label: "Nombre",
    align: "left",
    field: "name",
  },
  {
    name: "categoria",
    label: "Categoria",
    align: "left",
    field: (row) => row.category?.name,
  },
  {
    name: "sucursal",
    label: "Ubicación",
    align: "left",
    field: (row) => row.agency?.nombre,
  },
  {
    name: "precio",
    label: "Precio Sugerido",
    align: "left",
    field: "price_1",
    format: (val, row) => {
      const price = parseFloat(val || 0).toFixed(2);
      return `$ ${price} ${row.currency?.name ?? ''}`;
    }
  },
  {
    name: "activo",
    label: "Activo",
    align: "left",
    field: "active"
  },
  {
    name: "usado",
    label: "Usado",
    align: "left",
    field: "price_1"
  },
  {
    name: "ultimo_cambio",
    label: "Último Cambio",
    align: "left",
    field: "updated_at",
    format: (val) => {
      if (!val) return '';
      const date = new Date(val);
      return date.toLocaleString('es-MX', {
        month: 'short',
        day: 'numeric',
        year: "2-digit"
      });
    }
  }
];

const createItem = async () => {
  const ok = await add.value.validate();
  if (!ok) return false;

  const data = {
    ...add.value.formProducto,
    precios: Object.entries(add.value.precios)
      .filter(([_, precio]) => precio !== null && precio !== "")
      .map(([condicion_id, precio]) => ({
        condicion_pago_id: Number(condicion_id),
        precio: Number(precio)
      }))
  };

  await crudStore.postItem(BASE_URL, data, add.value.validate);
  return true;

};

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = {
    ...edit.value.formProducto,
    precios: Object.entries(edit.value.precios)
      .filter(([_, precio]) => precio !== null && precio !== "")
      .map(([condicion_id, precio]) => ({
        condicion_pago_id: Number(condicion_id),
        precio: Number(precio)
      }))
  };

  await crudStore.putItem(BASE_URL, data, edit.value.validate);
  return true;
};

const destroyItem = (item) => {
  crudStore.deleteItem(BASE_URL, item.id);
};

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/product/options",
    ""
  );

};

onMounted(() => {
  getOptions();
});
</script>
