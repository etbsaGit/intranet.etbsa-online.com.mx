<template>
  <!-- Título -->
  <q-item>
    <q-item-section>
      <q-item-label class="text-h6 text-primary text-center q-mb-md">
        📑 Documentos
      </q-item-label>
    </q-item-section>
  </q-item>

  <q-item v-for="(doc, index) in docs" :key="index">
    <q-item-section>
      <q-card
        flat
        bordered
        class="referencia-card"
        :class="isActive(doc) ? 'bg-white' : 'bg-red-2 text-white'"
        style="text-align: center"
      >
        <q-item class="text-subtitle1 text-primary" align="left">
          <!-- Checkbox -->
          <q-item-section avatar>
            <q-checkbox
              v-model="doc.checked"
              :model-value="isActive(doc)"
              :disable="true"
              :color="isActive(doc) ? 'green' : 'red'"
              keep-color
            />
          </q-item-section>

          <!-- Tipo / Status -->
          <q-item-section>
            <div>
              <b>📄 Tipo: </b>
              <span class="text-h6">{{ doc.status.nombre || "-" }}</span>
            </div>
          </q-item-section>

          <!-- Nombre -->
          <q-item-section>
            <div>
              <b>📄 Nombre: </b>
              <span class="text-h6">{{ doc.name || "-" }}</span>
            </div>
          </q-item-section>

          <!-- Fecha de vencimiento -->
          <q-item-section>
            <div>
              <b>⏳ Vencimiento: </b>
              <span class="text-h6">{{ doc.expiration_date || "-" }}</span>
            </div>
          </q-item-section>

          <!-- Botón de descarga -->
          <q-item-section side>
            <q-btn
              v-if="doc.realpath && isActive(doc)"
              dense
              color="primary"
              flat
              icon="file_download"
              @click="openWindow(doc)"
            />
          </q-item-section>
        </q-item>
      </q-card>
    </q-item-section>
  </q-item>
</template>

<script setup>
const { docs } = defineProps(["docs"]);

// Verifica si un documento está expirado
const isExpired = (date) => {
  if (!date) return false; // Sin fecha no está expirado
  return new Date(date) < new Date();
};

// Verifica si un documento es "activo" (path + no expirado)
const isActive = (item) => {
  return !!item.realpath && !isExpired(item.expiration_date);
};

// Abrir documento en nueva ventana
const openWindow = (item) => {
  if (item.realpath) {
    window.open(item.realpath, "_blank");
  }
};

// Inicializa checkbox según estado activo
docs.forEach((item) => {
  item.checked = isActive(item);
});
</script>

<style scoped>
.referencia-card {
  border-radius: 12px;
  font-family: "Segoe UI", sans-serif;
  transition: transform 0.2s;
}

.referencia-card:hover {
  transform: translateY(-3px);
}

.text-subtitle1 {
  font-size: 14px;
  font-weight: 600;
}

.text-h6 {
  font-size: 16px;
}
</style>
