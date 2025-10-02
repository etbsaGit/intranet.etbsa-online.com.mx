<template>
  <div v-if="fincas?.length">
    <q-item dense>
      <q-item-section>
        <q-item-label class="text-h6 text-primary text-center q-mb-md">
          🏡Fincas y terrenos
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item dense>
      <q-item-section v-for="finca in fincas" :key="finca.id">
        <q-card
          flat
          bordered
          class="bg-white referencia-card"
          style="text-align: center"
        >
          <div class="text-subtitle1 text-primary">
            <b>Nombre: </b>
            <strong class="text-h6 text-dark">
              {{ finca.nombre }}
            </strong>
          </div>

          <div class="text-subtitle1 text-primary">
            <b>Descripcion: </b>
            <strong class="text-h6 text-positive">
              {{ finca.descripcion }}
            </strong>
          </div>

          <div class="text-subtitle1 text-primary">
            <b>Tipo: </b>
            <strong class="text-h6 text-positive">
              {{ finca.estatus.nombre }}
            </strong>
          </div>
          <div class="text-subtitle1 text-primary">
            <b>Valor: </b>
            <strong class="text-h6 text-positive">
              {{ formatCurrency(finca.valor) }}
            </strong>
          </div>
          <div class="text-subtitle1 text-primary">
            <b>Costo: </b>
            <strong class="text-h6 text-positive">
              {{ formatCurrency(finca.costo) }}
            </strong>
          </div>
        </q-card>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup>
import { formatCurrency } from "src/boot/format";

const { fincas } = defineProps(["fincas"]);
</script>
