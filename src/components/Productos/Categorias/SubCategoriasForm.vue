<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formSubCat.name"
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
          v-model="formSubCat.category_id"
          :options="categorias"
          label="Categoría"
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
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { subcat } = defineProps(["subcat"]);

const myForm = ref(null);

const categorias = ref([]);

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/product-subcategorium/options",
  );
  categorias.value = res.categorias;
};

const formSubCat = ref({
  id: subcat ? subcat.id : null,
  name: subcat ? subcat.name : null,
  category_id: subcat ? subcat.category_id : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formSubCat,
  validate,
});
</script>
