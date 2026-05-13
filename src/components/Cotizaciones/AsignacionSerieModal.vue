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

      <div class="text-h6 q-mt-lg ">
        Notas del Vendedor:
      </div>
      {{ cotizacion?.notas || "Sin notas" }}

    </q-item-section>

    <q-item-section>

      <div class="text-h5">
        Asignación:
      </div>

      <div class="row items-center q-col-gutter-md ">
        <div class="col">
          <q-btn outline color="primary" icon="search" label="Seleccionar Tractor" @click="dialogInventario = true" />

          <div v-if="selectedItem" class="q-mt-md">

            <q-card flat bordered>

              <q-card-section>

                <div>
                  <strong>Serie:</strong>
                  {{ selectedItem.s_n }}
                </div>

                <div>
                  <strong>Modelo:</strong>
                  {{ selectedItem.inv_model?.code }}
                </div>

                <div>
                  <strong>Sucursal:</strong>
                  {{ selectedItem.sucursal?.nombre }}
                </div>

              </q-card-section>

            </q-card>

          </div>
        </div>
      </div>
      <div class="row justify-end ">
        <q-btn color="primary" label="Asignar Número de Serie" @click="autorizarPedido" />
      </div>
    </q-item-section>

    <!-- modal -->
    <q-dialog v-model="dialogInventario" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card>

        <q-card-section class="row items-center">
          <div class="text-h6">
            Seleccionar Tractor
          </div>

          <q-space />

          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <!-- buscador -->
          <q-input v-model="filter" outlined dense debounce="300" placeholder="Buscar" class="q-mb-md">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <!-- tabla -->
          <q-table flat bordered dense separator="cell" :rows="inventario" :columns="columnsInventario" row-key="id"
            :filter="filter" :filter-method="filterMethod" :pagination="{ rowsPerPage: 15 }" v-model:selected="selected">

            <template v-slot:body-cell-actions="props">
              <q-td align="center">

                <q-btn color="primary" label="Seleccionar" size="sm" @click="selectItem(props.row)" />

              </q-td>
            </template>

            <template v-slot:body-cell-info="props">
              <q-td>

                <div>
                  <strong>Serie:</strong>
                  {{ props.row.s_n || "-" }}
                </div>

                <div>
                  <strong>RD:</strong>
                  {{ props.row.rd || "-" }}
                </div>

                <div>
                  <strong>Eco:</strong>
                  {{ props.row.e_n || "-" }}
                </div>

              </q-td>
            </template>

          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-form>


</template>



<script setup>
import { ref, watch, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";
import { sendRequest } from "src/boot/functions";


const feedback = ref("");
const validation = ref(null);
const myForm = ref(null);
const crud = useCrudStore();
const inventario = ref([]);
const items = ref([]);
const item_id = ref(null);

const dialogInventario = ref(false);
const filter = ref("");
const selected = ref([]);
const selectedItem = ref(null);

const columnsInventario = [
  {
    name: "info",
    label: "Información",
    field: "info",
    align: "left"
  },
  {
    name: "modelo",
    label: "Modelo",
    field: row => row.inv_model?.name || "-",
    align: "left"
  },
  {
    name: "sucursal",
    label: "Sucursal",
    field: row => row.sucursal?.nombre || "-",
    align: "left"
  },
  {
    name: "estatus",
    label: "Estatus",
    field: row => row.estatus?.nombre || "-",
    align: "left"
  },
  {
    name: "actions",
    label: "Seleccionar",
    field: "actions",
    align: "center"
  }
];

const selectItem = (row) => {
  item_id.value = row.id;
  selectedItem.value = row;
  dialogInventario.value = false;
}
const baseURL = "/api/intranet/trackingAutorizacion";

const getInventario = async () => {
  const res = await sendRequest("GET", null, "/api/intranet/invItem/inventario");
  console.log(res.items);
  inventario.value = res.items || [];
};

const filterMethod = (rows, terms) => {

  const search = terms.toLowerCase();

  return rows.filter(row => {

    return (
      row.s_n?.toLowerCase().includes(search) ||
      row.rd?.toLowerCase().includes(search) ||
      row.e_n?.toLowerCase().includes(search) ||
      row.inv_model?.name?.toLowerCase().includes(search) ||
      row.sucursal?.nombre?.toLowerCase().includes(search) ||
      row.estatus?.nombre?.toLowerCase().includes(search)
    );

  });

};

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
  // {
  //   name: "precio",
  //   label: "Precio",
  //   align: "right",
  //   field: row =>
  //     `$${formatMoney(row.precio_unidad)} ${props.cotizacion?.currency?.name || ""}`
  // },
  // {
  //   name: "subtotal",
  //   label: "Subtotal",
  //   align: "right",
  //   field: row =>
  //     `$${formatMoney(row.subtotal)} ${props.cotizacion?.currency?.name || ""}`
  // }
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
  // {
  //   name: "precio",
  //   label: "Precio",
  //   align: "right",
  //   field: row =>
  //     `$${formatMoney(row.precio_unidad)} ${props.cotizacion?.currency?.name || ""}`
  // },
  // {
  //   name: "subtotal",
  //   label: "Subtotal",
  //   align: "right",
  //   field: row =>
  //     `$${formatMoney(row.subtotal)} ${props.cotizacion?.currency?.name || ""}`
  // }
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

  if (!item_id.value) {
    crud.showError("Selecciona un tractor");
    return;
  }

  const data = {
    comentario: feedback.value,
    validation: validation.value,
    item_id: item_id.value
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
  () => props.cotizacion?.id,
  async (val) => {

    if (!val) return;

    item_id.value = null;

    await getInventario();

  },
  { immediate: true }
);


</script>
