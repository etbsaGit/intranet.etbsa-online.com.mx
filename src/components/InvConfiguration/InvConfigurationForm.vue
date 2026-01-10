<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formConfiguration.name"
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
        <q-input
          v-model="formConfiguration.code"
          outlined
          dense
          label="Codigo"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>

      <q-item-section>
        <q-input
          v-model="formConfiguration.price"
          outlined
          dense
          label="Precio"
          lazy-rules
          prefix="$"
          mask="###,###,###,###"
          unmasked-value
          reverse-fill-mask
          input-class="text-right"
          :rules="[
            (val) =>
              val === null ||
              val === '' ||
              Number(val) > 0 ||
              'Debe ser mayor a 0',
          ]"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formConfiguration.inv_category_id"
          :options="invCategories"
          label="Categoria"
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
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>
                  {{ scope.opt.name }}
                </q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption>
                  {{ scope.opt.inv_group?.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formConfiguration.description"
          outlined
          dense
          label="Descripcion"
          type="textarea"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { invConfiguration } = defineProps(["invConfiguration"]);

const invCategories = ref([]);

const myForm = ref(null);

const formConfiguration = ref({
  id: invConfiguration ? invConfiguration.id : null,
  code: invConfiguration ? invConfiguration.code : null,
  name: invConfiguration ? invConfiguration.name : null,
  price: invConfiguration ? invConfiguration.price : null,
  inv_category_id: invConfiguration ? invConfiguration.inv_category_id : null,
  description: invConfiguration ? invConfiguration.description : null,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/invConfiguration/forms",
    ""
  );
  invCategories.value = res.invCategories;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formConfiguration,
  validate,
});
</script>
