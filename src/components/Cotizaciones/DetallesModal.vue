<template>
  <q-form ref="myForm">


    <q-item-section>

      <div class="text-h5 q-mb-md">
        Folio: #{{ cotizacion?.folio }}
      </div>

      <div class="">
        <strong>Cliente:</strong> {{ cotizacion?.cliente?.nombre }}
      </div>

      <div class="">
        <strong>Categoría:</strong> {{ cotizacion?.categoria?.name }}
      </div>

      <div class="">
        <strong>Sucursal:</strong> {{ cotizacion?.sucursal?.nombre }}
      </div>

      <div class="">
        <strong>Vendedor:</strong> {{ cotizacion?.vendedor?.nombreCompleto }}
      </div>

      <div class="">
        <strong>Departamento:</strong> {{ cotizacion?.depto?.nombre }}
      </div>

      <div class="text-h6 q-mt-lg">
        Productos Cotizados
      </div>

      <q-table flat bordered dense :rows="cotizacion?.detalles || []" :columns="columnsProductos" row-key="id"
        hide-pagination />

      <div class="text-h6 q-mt-lg ">
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

    </q-item-section>

    <q-item-section>

      <div class="text-h5">
        Autorización:
      </div>

      <div class="row items-center q-col-gutter-md q-mt-md">

        <div class="col">
          <q-input outlined dense v-model="feedback" label="Retroalimentación" :rules="[
            val => validation !== 0 || !!val || 'La retroalimentación es obligatoria'
          ]" />
        </div>

        <div class="col-auto">

          <q-toggle v-model="validation" :true-value="1" :false-value="0" checked-icon="check" unchecked-icon="close"
            :color="validation === 1 ? 'green' : 'red'" size="lg" keep-color />

        </div>

        <div class="col-auto">

          <div class="text-weight-bold" :class="validation === 1
            ? 'text-green'
            : validation === 0 ? 'text-red' : 'text-grey'
            ">
            {{ validation === 1 ? 'AUTORIZADO' : validation === 0 ? 'RECHAZADO' : 'PENDIENTE' }}
          </div>

        </div>

      </div>
      <div class="row justify-end q-mt-lg">
        <q-btn color="primary" label="Guardar Validación" @click="autorizarPedido" />
      </div>
    </q-item-section>

  </q-form>
</template>



<script setup>
import { ref, watch } from "vue";
import { useCrudStore } from "src/stores/crud";

const feedback = ref("");
const validation = ref(null);
const myForm = ref(null);
const crud = useCrudStore();

const baseURL = "/api/intranet/trackingAutorizacion";

const props = defineProps({
  cotizacion: Object
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

const emit = defineEmits([
  "success"
]);

const autorizarPedido = async () => {

  const ok = await myForm.value.validate();

  if (!ok) return;

  if (validation.value === null) return;

  const situacion =
    validation.value === 1
      ? "Autorizado"
      : "Sin Formalizar";

  const data = {
    comentario: feedback.value,
    validation: validation.value
  };

  await crud.postItem(
    `${baseURL}/autorizarPedido/${props.cotizacion.id}/${situacion}`,
    data,
    () => myForm.value.validate(),
    () => {
      emit("success");
    }
  );
};


watch(
  () => props.cotizacion,
  () => {
    validation.value = null;
    feedback.value = "";
  },
  { immediate: true }
);

</script>
