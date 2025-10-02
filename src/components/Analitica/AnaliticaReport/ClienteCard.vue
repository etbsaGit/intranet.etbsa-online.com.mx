<template>
  <q-item>
    <q-item-section>
      <q-item-label class="text-h6 text-primary text-center q-mb-md">
        👤 Información del Cliente
      </q-item-label>
    </q-item-section>
  </q-item>
  <!-- Tarjetas resumen -->
  <q-item>
    <!-- Nombre -->
    <q-item-section>
      <q-card
        flat
        bordered
        class="bg-white q-pa-md"
        style="min-width: 150px; text-align: center"
      >
        <q-icon class="text-primary" name="fas fa-user" size="20px" />
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Nombre</div>
        <div class="text-h6 text-dark">{{ cliente.nombre }}</div>
      </q-card>
    </q-item-section>

    <!-- RFC -->
    <q-item-section>
      <q-card
        flat
        bordered
        class="bg-white q-pa-md"
        style="min-width: 150px; text-align: center"
      >
        <q-icon class="text-indigo" name="fas fa-id-card" size="20px" />
        <div class="text-subtitle2 text-grey-7 q-mt-sm">RFC</div>
        <div class="text-h6 text-indigo">{{ cliente.rfc }}</div>
      </q-card>
    </q-item-section>

    <!-- Teléfono -->
    <q-item-section>
      <q-card
        flat
        bordered
        class="bg-white q-pa-md"
        style="min-width: 150px; text-align: center"
      >
        <q-icon class="text-positive" name="fas fa-phone" size="20px" />
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Teléfono</div>
        <div class="text-h6 text-positive">
          {{ formatPhoneNumber(cliente.telefono) }}
        </div>
      </q-card>
    </q-item-section>

    <!-- Email -->
    <q-item-section>
      <q-card
        flat
        bordered
        class="bg-white q-pa-md"
        style="min-width: 150px; text-align: center"
      >
        <q-icon class="text-negative" name="fas fa-envelope" size="20px" />
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Email</div>
        <div class="text-h6 text-negative">{{ cliente.email }}</div>
      </q-card>
    </q-item-section>
  </q-item>
  <!-- Dirección -->
  <q-item>
    <q-item-section>
      <q-card
        flat
        bordered
        class="bg-white q-pa-md"
        style="min-width: 150px; text-align: center"
      >
        <q-icon class="text-warning" name="fas fa-map-marker-alt" size="20px" />
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Dirección</div>
        <div class="text-h6 text-warning">
          {{ cliente.calle }}, Col. {{ cliente.colonia }}, CP
          {{ cliente.codigo_postal }}, {{ cliente.town?.name }}
          {{ cliente.state_entity?.name }}
        </div>
      </q-card>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { formatPhoneNumber } from "src/boot/format";

const { cliente } = defineProps(["cliente"]);
</script>
