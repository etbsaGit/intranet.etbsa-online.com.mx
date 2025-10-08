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
    <q-item>
      <q-item-section>
        <q-input
          v-model="formReferencia.empresa"
          filled
          dense
          label="Empresa"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formReferencia.negocio"
          filled
          dense
          label="Negocio"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formReferencia.domicilio"
          filled
          dense
          label="Domicilio"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
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
  empresa: referencia ? referencia.empresa : null,
  negocio: referencia ? referencia.negocio : null,
  domicilio: referencia ? referencia.telefono : null,
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
