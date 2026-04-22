<template>
  <BaseCatalogo title="Contra Pesos" :columns="columns" url="/api/intranet/tractor-contrapesos"
    :on-create="createItem"
  >
    <template #create-form>
      <contra-pesos-form ref="add" />
    </template>

  </BaseCatalogo>

</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";
import { sendRequest } from "src/boot/functions";

import BaseCatalogo from "src/bases/BaseCatalogo.vue";
import ContraPesosForm from "./ContraPesosForm.vue";

const crudStore = useCrudStore();

const add = ref(null);
const edit = ref(null);
const BASE_URL = "/api/intranet/tractor-contrapeso"

const columns = [
  {
    name: "actions",
    align: "left",
    field: "actions",
  },
  {
    name: "nro_parte",
    label: "#Parte",
    align: "left",
    field: "nro_parte"
  },
  {
    name: "descripcion",
    label: "Descripción",
    align: "left",
    field: "descripcion"
  },
  {
    name: "costo",
    label: "Costo",
    align: "left",
    field: "costo"
  },
  {
    name: "precio",
    label: "Precio",
    align: "left",
    field: "precio"
  },
];

const createItem = async () => {
  const ok = await add.value.myForm;
  if (!ok) return false;

  const data = {
    ...add.value.formContraPeso,

    tractores: add.value.tractoresSeleccionados.map((tractor) => ({
      id: tractor.value
    }))
  };

  await crudStore.postItem(
    BASE_URL,
    data,
    add.value.myForm.validate
  );

  return true;
};
</script>
