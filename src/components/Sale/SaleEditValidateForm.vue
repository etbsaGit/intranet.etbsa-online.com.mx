<template>
  <q-form ref="myForm" greedy>
    <q-item class="custom-label">
      <q-item-section>
        <q-item-label>Cliente</q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label>Referencia</q-item-label>
      </q-item-section>
      <q-item-section class="col-2">
        <q-item-label>Celular</q-item-label>
      </q-item-section>
      <q-item-section class="col-2">
        <q-item-label>Tel casa</q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label>Email</q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label>Retroalimentacion</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label>Validado</q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label>{{ sale.cliente.nombre }}</q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ sale.referencia?.nombre }}</q-item-label>
        <q-item-label>
          {{ formatPhoneNumber(sale.referencia?.telefono) }}
        </q-item-label>
      </q-item-section>
      <q-item-section class="col-2">
        <q-item-label>
          {{ formatPhoneNumber(sale.cliente.telefono) }}
        </q-item-label>
      </q-item-section>
      <q-item-section class="col-2">
        <q-item-label>
          {{ formatPhoneNumber(sale.cliente.telefono_casa) }}
        </q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ sale.cliente.email }}</q-item-label>
      </q-item-section>
      <q-item-section>
        <q-input
          outlined
          dense
          v-model="formSale.feedback"
          label="Escribe tu retroalimentación"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        ></q-input>
      </q-item-section>
      <q-item-section side>
        <q-toggle
          :color="formSale.validated == 0 ? 'red' : 'green'"
          keep-color
          v-model="formSale.validated"
          checked-icon="check"
          unchecked-icon="close"
          indeterminate-icon="error"
          :true-value="1"
          :false-value="0"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import { formatPhoneNumber } from "src/boot/format";

const { sale } = defineProps(["sale"]);

const myForm = ref(null);

const formSale = ref({
  id: sale ? sale.id : null,
  amount: sale ? sale.amount : null,
  comments: sale ? sale.comments : null,
  serial: sale ? sale.serial : null,
  invoice: sale ? sale.invoice : null,
  order: sale ? sale.order : null,
  folio: sale ? sale.folio : null,
  economic: sale ? sale.economic : null,
  validated: sale ? sale.validated : null,
  date: sale ? sale.date : null,
  cliente_id: sale ? sale.cliente_id : null,
  status_id: sale ? sale.status_id : null,
  feedback: sale ? sale.feedback : null,
  validated: sale ? sale.validated : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

// Define y expone el array de objetos
defineExpose({
  formSale,
  validate,
});
</script>

<style scoped>
.custom-item {
  border-radius: 8px; /* Bordes redondeados */
  padding: 10px; /* Espaciado interno */
}

.custom-label {
  font-size: 1.2em; /* Tamaño de fuente aumentado */
  font-weight: bold; /* Negrita */
}
</style>
