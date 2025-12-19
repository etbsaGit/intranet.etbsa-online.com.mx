<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCategory.name"
          outlined
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formCategory.inv_group_id"
          :options="invGroups"
          label="Grupo"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          options-dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formCategory.status_id"
          :options="estatus"
          label="Tipo"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          options-dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <!-- <q-item>
      <q-item-section>
        <q-input
          v-model="formCategory.description"
          outlined
          dense
          label="Descripcion"
          type="textarea"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item> -->
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { invCategory } = defineProps(["invCategory"]);

const myForm = ref(null);

const invGroups = ref([]);
const estatus = ref([]);

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/invCategory/forms",
    ""
  );
  invGroups.value = res.invGroups;
  estatus.value = res.estatus;
};

const formCategory = ref({
  id: invCategory ? invCategory.id : null,
  name: invCategory ? invCategory.name : null,
  description: invCategory ? invCategory.description : null,
  status_id: invCategory ? invCategory.status_id : null,
  inv_group_id: invCategory ? invCategory.inv_group_id : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formCategory,
  validate,
});
</script>
