<template>
  <BaseDialog v-model="dialog" mode="edit" titleEdit="Detalles de cotización">
    <!-- 👇 SLOT form -->
    <template #form>

      <div class="q-pa-md">

        <div class="text-h5 q-mb-md">
          Folio: #{{ cotizacion?.folio }}
        </div>

        <div class="q-mb-sm">
          <strong>Cliente:</strong> {{ cotizacion?.cliente?.nombre }}
        </div>

        <div class="q-mb-sm">
          <strong>Categoría:</strong> {{ cotizacion?.categoria?.name }}
        </div>

        <div class="q-mb-sm">
          <strong>Sucursal:</strong> {{ cotizacion?.sucursal?.nombre }}
        </div>

        <div class="q-mb-sm">
          <strong>Vendedor:</strong> {{ cotizacion?.vendedor?.nombreCompleto }}
        </div>

        <div class="q-mb-sm">
          <strong>Departamento:</strong> {{ cotizacion?.depto?.nombre }}
        </div>

        <div class="text-h6 q-mt-lg q-mb-sm">
          Productos Cotizados
        </div>

        <q-table flat bordered dense :rows="cotizacion?.detalles || []" :columns="columnsProductos" row-key="id"
          hide-pagination />

        <div class="text-h6 q-mt-xl q-mb-sm">
          Extras
        </div>

        <q-table flat bordered dense :rows="cotizacion?.extras || []" :columns="columnsExtras" row-key="id"
          hide-pagination />

        <div class="row q-mt-xl">
          <div style="min-width: 320px;">

            <div class="q-mb-sm">
              <strong>Subtotal:</strong>
              ${{ formatMoney(cotizacion?.subtotal) }}
              {{ cotizacion?.currency?.name }}
            </div>

            <div class="q-mb-sm">
              <strong>IVA:</strong>
              ${{ formatMoney(cotizacion?.iva_monto) }}
              {{ cotizacion?.currency?.name }}
            </div>

            <div class="q-mb-sm">
              <strong>Descuento:</strong>
              ${{ formatMoney(cotizacion?.descuento) }}
              {{ cotizacion?.currency?.name }}
            </div>

            <div class="q-mb-sm text-h6">
              <strong>Total:</strong>
              ${{ formatMoney(cotizacion?.total) }}
              {{ cotizacion?.currency?.name }}
            </div>

            <div class="q-mb-sm">
              <strong>Anticipo:</strong>
              ${{ formatMoney(cotizacion?.anticipo_monto) }}
              {{ cotizacion?.currency?.name }}
            </div>

          </div>
        </div>

      </div>

    </template>
  </BaseDialog>
</template>

<script setup>
import { computed } from "vue";
import BaseDialog from "src/bases/BaseDialog.vue";

const props = defineProps({
  modelValue: Boolean,
  cotizacion: Object
});

const emit = defineEmits(["update:modelValue"]);

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
});

const columnsProductos = [
  {
    name: "sku",
    label: "SKU",
    align: "left",
    field: row => row.productos?.sku || "-"
  },
  {
    name: "producto",
    label: "Producto",
    align: "left",
    field: row => row.productos?.name || "-"
  },
  {
    name: "cantidad",
    label: "Cantidad",
    align: "center",
    field: "cantidad"
  },
  {
    name: "precio",
    label: "Precio",
    align: "right",
    field: row =>
      `$${formatMoney(row.precio_unidad)} ${props.cotizacion?.currency?.name || ""}`
  },
  {
    name: "subtotal",
    label: "Subtotal",
    align: "right",
    field: row =>
      `$${formatMoney(row.subtotal)} ${props.cotizacion?.currency?.name || ""}`
  }
];

const columnsExtras = [
  {
    name: "sku",
    label: "SKU",
    align: "left",
    field: row => row.item?.nro_parte || "-"
  },
  {
    name: "descripcion",
    label: "Descripción",
    align: "left",
    field: row => row.item?.descripcion || "-"
  },
  {
    name: "cantidad",
    label: "Cantidad",
    align: "center",
    field: "cantidad"
  },
  {
    name: "precio",
    label: "Precio",
    align: "right",
    field: row =>
      `$${formatMoney(row.precio_unidad)} ${props.cotizacion?.currency?.name || ""}`
  },
  {
    name: "subtotal",
    label: "Subtotal",
    align: "right",
    field: row =>
      `$${formatMoney(row.subtotal)} ${props.cotizacion?.currency?.name || ""}`
  }
];

const formatMoney = (value) => {
  return Number(value || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>
