<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formDistribucion.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formDistribucion.ubicacion"
          filled
          dense
          label="Ubicacion"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formDistribucion.hectareas_propias"
          filled
          dense
          label="Hectareas propias"
          lazy-rules
          hint
          mask="#####"
          reverse-fill-mask
          unmasked-value
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formDistribucion.hectareas_rentadas"
          filled
          dense
          label="Hectareas rentadas"
          lazy-rules
          hint
          mask="#####"
          reverse-fill-mask
          unmasked-value
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { distribucion, cliente } = defineProps(["distribucion", "cliente"]);

const myForm = ref(null);

const formDistribucion = ref({
  id: distribucion ? distribucion.id : null,
  nombre: distribucion ? distribucion.nombre : null,
  ubicacion: distribucion ? distribucion.ubicacion : null,
  hectareas_propias: distribucion ? distribucion.hectareas_propias : null,
  hectareas_rentadas: distribucion ? distribucion.hectareas_rentadas : null,
  cliente_id: distribucion ? distribucion.cliente_id : cliente.id,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formDistribucion,
  validate,
});
</script>
