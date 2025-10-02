<template>
  <div v-if="referencias[0]">
    <q-item>
      <q-item-section>
        <q-item-label class="text-h6 text-primary text-center q-mb-md">
          👥 Referencias personales
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section v-for="(ref, index) in referencias" :key="index">
        <q-card
          flat
          bordered
          class="bg-white referencia-card"
          style="text-align: center"
        >
          <div class="text-subtitle1 text-primary">
            <b>👤Nombre: </b>
            <strong class="text-h6 text-dark">
              {{ ref.nombre }}
            </strong>
          </div>

          <div class="text-subtitle1 text-primary">
            <b>📞Teléfono: </b>
            <strong class="text-h6 text-positive">
              {{ formatPhoneNumber(ref.telefono) }}
            </strong>
          </div>

          <div class="text-subtitle1 text-primary">
            <b>👨‍👩‍👧‍👦Parentesco: </b>
            <strong class="text-h6 text-indigo">
              {{ ref.kinship.name }}
            </strong>
          </div>
        </q-card>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup>
import { formatPhoneNumber } from "src/boot/format";

const { referencias } = defineProps(["referencias"]);
</script>

<style scoped>
.referencia-card {
  border-radius: 12px;
  font-family: "Segoe UI", sans-serif;
}

.text-subtitle1 {
  font-size: 14px;
  font-weight: 600;
}

.text-h6 {
  font-size: 16px;
}
</style>
