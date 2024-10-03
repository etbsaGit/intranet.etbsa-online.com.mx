<template>
  <q-form ref="myForm" greedy>
    <q-list separator>
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
      <q-item v-for="(sale, index) in sales" :key="sale.id">
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
            v-model="feedbacks[index]"
            label="Escribe tu retroalimentación"
            :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          ></q-input>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            :color="validations[index] == 0 ? 'red' : 'green'"
            keep-color
            v-model="validations[index]"
            checked-icon="check"
            unchecked-icon="close"
            indeterminate-icon="error"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-form>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatPhoneNumber } from "src/boot/format";

const myForm = ref(null);
const sales = ref([]);
const feedbacks = ref([]);
const validations = ref([]);

// Función para obtener las ventas
const getSales = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/sale/validated", "");
  sales.value = res;
  // Inicializa los arrays de feedbacks y validations
  feedbacks.value = Array(res.length).fill(null);
  validations.value = Array(res.length).fill(null);
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getSales();
});

// Computed para generar el array de objetos
const salesData = computed(() => {
  return sales.value.map((sale, index) => ({
    id: sale.id,
    feedback: feedbacks.value[index],
    validated: validations.value[index],
  }));
});

// Define y expone el array de objetos
defineExpose({
  salesData,
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
