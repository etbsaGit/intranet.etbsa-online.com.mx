<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formReferencia.nombre"
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
          filled
          dense
          v-model="formReferencia.telefono"
          label="Telefono movil"
          mask="(###) ### - ####"
          unmasked-value
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template v-slot:prepend>
            <q-icon name="fa-brands fa-whatsapp" />
          </template>
        </q-input>
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { referencia, cliente } = defineProps(["referencia", "cliente"]);

const myForm = ref(null);

const formReferencia = ref({
  id: referencia ? referencia.id : null,
  nombre: referencia ? referencia.nombre : null,
  telefono: referencia ? referencia.telefono : null,
  cliente_id: referencia ? referencia.cliente_id : cliente.id,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formReferencia,
  validate,
});
</script>
