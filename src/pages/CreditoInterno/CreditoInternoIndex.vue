<template>
  <div>
    <!-- Barra de pestañas principal: Dashboard Ejecutivo / Calendario de Cobranza / Solicitudes -->
    <q-tabs
      v-model="activeTab"
      dense
      class="bg-white text-grey-8 shadow-1"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab
        v-if="isAdminOrCredito"
        name="dashboard"
        icon="analytics"
        label="Dashboard Ejecutivo"
        class="text-weight-bold q-px-md"
      />
      <q-tab
        name="calendario"
        icon="calendar_month"
        label="Calendario de Cobranza"
        class="text-weight-bold q-px-md"
      />
      <q-tab
        name="solicitudes"
        icon="table_chart"
        label="Solicitudes y Catálogo"
        class="text-weight-bold q-px-md"
      />
      <q-tab
        name="aplazamientos"
        icon="pending_actions"
        label="Solicitudes de Aplazamiento"
        class="text-weight-bold q-px-md"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="activeTab" animated class="bg-grey-1">
      <!-- Pestaña 1: Dashboard Ejecutivo con ApexCharts (Solo Admin y Credito) -->
      <q-tab-panel v-if="isAdminOrCredito" name="dashboard" class="q-pa-none">
        <CreditoInternoDashboard />
      </q-tab-panel>

      <!-- Pestaña 2: Calendario y Reporte Mensual de Cobranza -->
      <q-tab-panel name="calendario" class="q-pa-none">
        <CreditoInternoCalendario />
      </q-tab-panel>

      <!-- Pestaña 3: Listado y Gestión de Solicitudes -->
      <q-tab-panel name="solicitudes" class="q-pa-none">
        <BaseCatalogo
          ref="catalogoRef"
          :onCreate="false"
          title="Solicitudes Crédito Interno"
          :columns="columns"
          url="/api/intranet/creditoInternos"
          :on-delete="false"
          :initial-filters="{
            sucursal_id: null,
            asesor_id: null,
            estatus_id: null,
            linea_id: null,
          }"
        >
          <!-- Filtros extra -->
          <template #filters-extra="{ filters, onSearchChange }">
            <CreditoFiltros
              :filters="filters"
              :options="options"
              @update:filter="(key, val) => (filters[key] = val)"
              @clear="
                Object.assign(filters, {
                  sucursal_id: null,
                  asesor_id: null,
                  estatus_id: null,
                  linea_id: null,
                })
              "
              @update="onSearchChange"
            />
          </template>

          <!-- Columna: Folio -->
          <template v-slot:body-cell-folio="props">
            <q-td :props="props">
              <q-chip
                dense
                color="indigo-1"
                text-color="indigo-9"
                class="text-weight-bold q-px-sm"
                icon="receipt_long"
              >
                #{{ props.row.folio || props.row.id }}
              </q-chip>
            </q-td>
          </template>

          <!-- Columna: Cliente -->
          <template v-slot:body-cell-cliente="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-avatar
                  size="32px"
                  color="primary"
                  text-color="white"
                  icon="person"
                  class="q-mr-sm shadow-1"
                />
                <div>
                  <div class="text-weight-bold text-primary text-body2">
                    {{ props.row.cliente?.nombre || "Cliente no especificado" }}
                  </div>
                  <div
                    class="text-caption text-grey-7 flex items-center q-gutter-xs"
                  >
                    <span v-if="props.row.cliente?.rfc">
                      RFC: {{ props.row.cliente.rfc }}
                    </span>
                    <span
                      v-if="
                        props.row.cliente?.rfc && props.row.cliente?.telefono
                      "
                    >
                      •
                    </span>
                    <span v-if="props.row.cliente?.telefono">
                      {{ formatPhoneNumber(props.row.cliente.telefono) }}
                    </span>
                  </div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Columna: Línea de Crédito -->
          <template v-slot:body-cell-linea="props">
            <q-td :props="props">
              <q-badge
                v-if="props.row.linea?.name"
                color="blue-grey-1"
                text-color="blue-grey-9"
                class="text-weight-bold q-pa-xs"
              >
                <q-icon
                  name="category"
                  size="xs"
                  class="q-mr-xs"
                  color="blue-grey-8"
                />
                {{ props.row.linea?.name }}
              </q-badge>
              <div v-else class="text-caption text-grey-5">Sin línea</div>
            </q-td>
          </template>

          <!-- Columna: Asesor / Sucursal -->
          <template v-slot:body-cell-asesor="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-avatar
                  size="28px"
                  color="teal-1"
                  text-color="teal-9"
                  icon="badge"
                  class="q-mr-xs"
                />
                <div>
                  <div class="text-weight-medium text-dark">
                    {{ props.row.asesor?.nombreCompleto || "Sin asesor" }}
                  </div>
                  <div v-if="props.row.sucursal?.nombre" class="text-caption">
                    <q-badge
                      color="grey-3"
                      text-color="grey-9"
                      class="text-weight-bold"
                    >
                      <q-icon name="store" size="xs" class="q-mr-xs" />
                      {{ props.row.sucursal.nombre }}
                    </q-badge>
                  </div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Columna: Monto Solicitado -->
          <template v-slot:body-cell-monto_solicitado="props">
            <q-td :props="props">
              <div class="text-right">
                <div class="text-weight-bolder text-positive text-subtitle2">
                  {{ formatCurrency(props.row.monto_solicitado || 0) }}
                </div>
                <div
                  v-if="
                    props.row.valor_enganche &&
                    Number(props.row.valor_enganche) > 0
                  "
                  class="text-caption text-amber-9 text-weight-medium"
                >
                  Enganche:
                  {{ formatCurrency(props.row.valor_enganche) }}
                </div>
              </div>
            </q-td>
          </template>

          <!-- Columna: Estatus -->
          <template v-slot:body-cell-estatus="props">
            <q-td :props="props" align="center">
              <q-chip
                dense
                class="text-weight-bold text-white q-px-sm"
                :style="{
                  backgroundColor: props.row.estatus?.color || '#1976d2',
                }"
              >
                {{ props.row.estatus?.nombre || "Pendiente" }}
              </q-chip>
            </q-td>
          </template>

          <!-- Columna: VoBo Credito -->
          <template v-slot:body-cell-vobo_credito="props">
            <q-td :props="props" align="center">
              <div class="row items-center justify-center">
                <!-- Aprobado (Like) -->
                <q-avatar
                  v-if="getVoBoTipo(props.row) === 'aprobado'"
                  size="30px"
                  color="green-1"
                  text-color="positive"
                  icon="thumb_up"
                  class="shadow-1"
                  :class="isCredito ? 'cursor-pointer' : ''"
                  @click="isCredito ? verVoBo(props.row) : null"
                >
                  <q-tooltip class="bg-positive text-caption text-weight-bold">
                    {{
                      props.row.vo_bo_credito?.notas || "VoBo Crédito: Aprobado"
                    }}
                  </q-tooltip>
                </q-avatar>

                <!-- Rechazado (Dislike) -->
                <q-avatar
                  v-else-if="getVoBoTipo(props.row) === 'rechazado'"
                  size="30px"
                  color="red-1"
                  text-color="negative"
                  icon="thumb_down"
                  class="shadow-1"
                  :class="isCredito ? 'cursor-pointer' : ''"
                  @click="isCredito ? verVoBo(props.row) : null"
                >
                  <q-tooltip class="bg-negative text-caption text-weight-bold">
                    {{
                      props.row.vo_bo_credito?.notas ||
                      "VoBo Crédito: Rechazado"
                    }}
                  </q-tooltip>
                </q-avatar>

                <!-- Pendiente / Sin VoBo -->
                <q-badge
                  v-else
                  color="grey-2"
                  text-color="grey-7"
                  class="q-px-sm q-py-xs text-caption text-weight-medium rounded-borders"
                  :class="isCredito ? 'cursor-pointer' : ''"
                  @click="isCredito ? verVoBo(props.row) : null"
                >
                  <q-icon
                    name="hourglass_empty"
                    size="14px"
                    class="q-mr-xs text-grey-6"
                  />
                  <span>Pendiente</span>
                  <q-tooltip class="bg-grey-8 text-caption">
                    Sin VoBo de Crédito aún
                  </q-tooltip>
                </q-badge>
              </div>
            </q-td>
          </template>

          <!-- Columna: VoBo Gerencia -->
          <template v-slot:body-cell-vobo_gerencia="props">
            <q-td :props="props" align="center">
              <div class="row items-center justify-center">
                <!-- Aprobado (Like) -->
                <q-avatar
                  v-if="getVoBoGerenciaTipo(props.row) === 'aprobado'"
                  size="30px"
                  color="green-1"
                  text-color="positive"
                  icon="thumb_up"
                  class="shadow-1"
                  :class="isGerenteTerritorial ? 'cursor-pointer' : ''"
                  @click="
                    isGerenteTerritorial ? verVoBoGerencia(props.row) : null
                  "
                >
                  <q-tooltip class="bg-positive text-caption text-weight-bold">
                    {{
                      props.row.vo_bo_gerencia?.notas ||
                      "VoBo Gerencia: Aprobado"
                    }}
                  </q-tooltip>
                </q-avatar>

                <!-- Rechazado (Dislike) -->
                <q-avatar
                  v-else-if="getVoBoGerenciaTipo(props.row) === 'rechazado'"
                  size="30px"
                  color="red-1"
                  text-color="negative"
                  icon="thumb_down"
                  class="shadow-1"
                  :class="isGerenteTerritorial ? 'cursor-pointer' : ''"
                  @click="
                    isGerenteTerritorial ? verVoBoGerencia(props.row) : null
                  "
                >
                  <q-tooltip class="bg-negative text-caption text-weight-bold">
                    VoBo Gerencia: Rechazado
                    <div
                      v-if="parseVoBoGerencia(props.row).notas"
                      class="text-weight-normal"
                    >
                      {{ parseVoBoGerencia(props.row).notas }}
                    </div>
                  </q-tooltip>
                </q-avatar>

                <!-- Pendiente / Sin VoBo -->
                <q-badge
                  v-else
                  color="grey-2"
                  text-color="grey-7"
                  class="q-px-sm q-py-xs text-caption text-weight-medium rounded-borders"
                  :class="isGerenteTerritorial ? 'cursor-pointer' : ''"
                  @click="
                    isGerenteTerritorial ? verVoBoGerencia(props.row) : null
                  "
                >
                  <q-icon
                    name="hourglass_empty"
                    size="14px"
                    class="q-mr-xs text-grey-6"
                  />
                  <span>Pendiente</span>
                  <q-tooltip class="bg-grey-8 text-caption">
                    Sin VoBo de Gerencia aún
                  </q-tooltip>
                </q-badge>
              </div>
            </q-td>
          </template>

          <!-- Columna: Pagos -->
          <template v-slot:body-cell-pagos="props">
            <q-td :props="props">
              <div class="column items-start q-gutter-xs">
                <div
                  v-if="props.row.resumen_pagos"
                  class="flex items-center q-gutter-xs"
                >
                  <q-badge
                    color="blue-1"
                    text-color="blue-9"
                    class="text-weight-bold q-pa-xs"
                  >
                    <q-icon name="payments" size="xs" class="q-mr-xs" />
                    {{ props.row.resumen_pagos }}
                  </q-badge>
                </div>
                <div
                  v-if="props.row.proximo_pago"
                  class="text-caption text-grey-8 flex items-center q-gutter-xs"
                >
                  <q-icon name="event" color="orange-8" size="xs" />
                  <span>
                    Próximo: {{ formatFechaLarga(props.row.proximo_pago) }}
                  </span>
                </div>
                <div
                  v-if="!props.row.resumen_pagos && !props.row.proximo_pago"
                  class="text-caption text-grey-5"
                >
                  Sin programación
                </div>
              </div>
            </q-td>
          </template>

          <!-- Columna: Fecha -->
          <template v-slot:body-cell-created_at="props">
            <q-td :props="props" align="center">
              <div
                class="text-caption text-grey-8 flex items-center justify-center q-gutter-xs"
              >
                <q-icon name="calendar_today" size="xs" color="grey-6" />
                <span>{{ formatFechaLarga(props.row.created_at) }}</span>
              </div>
            </q-td>
          </template>

          <!-- Columna: Acciones / Detalles, Historial y Pagos -->
          <template v-slot:body-cell-detalles="props">
            <q-td :props="props" align="center">
              <div class="row items-center justify-center q-gutter-xs no-wrap">
                <!-- btn vobo credito -->
                <q-btn
                  v-if="
                    isCredito &&
                    props.row.vo_bo_gerencia &&
                    props.row.estatus.nombre === 'Crédito en Proceso'
                  "
                  flat
                  round
                  dense
                  icon="fact_check"
                  color="purple-8"
                  @click="verVoBo(props.row)"
                >
                  <q-tooltip class="bg-purple-8"
                    >Dictamen de VoBo de Crédito</q-tooltip
                  >
                </q-btn>
                <!-- btn vobo gerencia -->
                <q-btn
                  v-if="
                    (isGerenteTerritorial &&
                      props.row.estatus.nombre === 'Crédito en Proceso') ||
                    (isGerenteTerritorial &&
                      props.row.estatus.nombre === 'Crédito Solicitado')
                  "
                  flat
                  round
                  dense
                  icon="how_to_reg"
                  color="indigo-8"
                  @click="verVoBoGerencia(props.row)"
                >
                  <q-tooltip class="bg-indigo-8"
                    >Aprobación de Gerencia Territorial</q-tooltip
                  >
                </q-btn>
                <!-- btn ver detalles -->
                <q-btn
                  flat
                  round
                  dense
                  icon="visibility"
                  color="primary"
                  @click="verDetalles(props.row)"
                >
                  <q-tooltip class="bg-primary"
                    >Ver detalles completos</q-tooltip
                  >
                </q-btn>
                <!-- btn pagos -->
                <q-btn
                  v-if="
                    props.row.estatus.nombre !== 'Crédito Rechazado' &&
                    props.row.estatus.nombre !== 'Crédito Pagado'
                  "
                  flat
                  round
                  dense
                  icon="payments"
                  color="teal-8"
                  @click="verPagos(props.row)"
                >
                  <q-tooltip class="bg-teal-8"
                    >Control y gestión de pagos</q-tooltip
                  >
                </q-btn>
                <!-- btn historial -->
                <q-btn
                  flat
                  round
                  dense
                  icon="history"
                  color="indigo"
                  @click="verHistorial(props.row)"
                >
                  <q-tooltip class="bg-indigo"
                    >Ver historial de cambios</q-tooltip
                  >
                </q-btn>
              </div>
            </q-td>
          </template>
        </BaseCatalogo>
      </q-tab-panel>

      <!-- Pestaña 4: Solicitudes de Aplazamiento de Pagos -->
      <q-tab-panel name="aplazamientos" class="q-pa-none">
        <CreditoAplazamientosIndex />
      </q-tab-panel>
    </q-tab-panels>

    <!-- Modal de Detalles modular -->
    <CreditoDetallesModal v-model="showDetallesModal" :credito="selectedItem" />

    <!-- Modal de Dictamen VoBo de Crédito -->
    <CreditoVoBoModal
      v-model="showVoBoModal"
      :credito="selectedVoBoItem"
      @updated="onVoBoUpdated"
    />

    <!-- Modal de Aprobación de Gerencia Territorial -->
    <CreditoGerenciaModal
      v-model="showGerenciaModal"
      :credito="selectedGerenciaItem"
      @updated="onVoBoGerenciaUpdated"
    />

    <!-- Modal de Pagos del Crédito -->
    <CreditoPagosModal
      v-model="showPagosModal"
      :credito="selectedPagosItem"
      @updated="onPagosUpdated"
    />

    <!-- Modal de Historial de Cambios -->
    <CreditoHistorialModal
      v-model="showHistorialModal"
      :credito="selectedHistorialItem"
      :historial="selectedHistorialItem?.historial"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";
import { checkRole, checkPuesto } from "src/boot/functions";
import {
  formatPhoneNumber,
  formatCurrency,
  formatFechaLarga,
} from "src/boot/format";
import BaseCatalogo from "src/bases/BaseCatalogo.vue";
import CreditoFiltros from "src/components/CreditoInterno/CreditoFiltros.vue";
import CreditoDetallesModal from "src/components/CreditoInterno/CreditoDetallesModal.vue";
import CreditoHistorialModal from "src/components/CreditoInterno/CreditoHistorialModal.vue";
import CreditoPagosModal from "src/components/CreditoInterno/CreditoPagosModal.vue";
import CreditoVoBoModal from "src/components/CreditoInterno/CreditoVoBoModal.vue";
import CreditoGerenciaModal from "src/components/CreditoInterno/CreditoGerenciaModal.vue";
import CreditoVoBoStatusCard, {
  parseVoBoCredito,
  parseVoBoGerencia,
} from "src/components/CreditoInterno/CreditoVoBoStatusCard.vue";
import CreditoInternoDashboard from "src/components/CreditoInterno/Dashboard/CreditoInternoDashboard.vue";
import CreditoInternoCalendario from "src/components/CreditoInterno/Calendario/CreditoInternoCalendario.vue";
import CreditoAplazamientosIndex from "src/components/CreditoInterno/Aplazamientos/CreditoAplazamientosIndex.vue";

const isAdminOrCredito = computed(() => {
  return checkRole("Admin") || checkRole("Credito");
});

const isCredito = computed(() => {
  return checkRole("Credito");
});

const isGerenteTerritorial = computed(() => {
  return (
    checkPuesto("Gerente Territorial") || checkPuesto("Gerente territorial")
  );
});

const activeTab = ref("solicitudes");

const catalogoRef = ref(null);

const showDetallesModal = ref(false);
const selectedItem = ref(null);

const showVoBoModal = ref(false);
const selectedVoBoItem = ref(null);

const showGerenciaModal = ref(false);
const selectedGerenciaItem = ref(null);

const showPagosModal = ref(false);
const selectedPagosItem = ref(null);

const showHistorialModal = ref(false);
const selectedHistorialItem = ref(null);
const options = ref([]);

const crud = useCrudStore();

const columns = [
  {
    name: "folio",
    label: "Folio",
    field: (row) => row.folio || row.id,
    sortable: true,
    align: "center",
  },
  {
    name: "cliente",
    label: "Cliente",
    field: (row) => row.cliente?.nombre || "Sin cliente",
    sortable: true,
    align: "left",
  },
  {
    name: "linea",
    label: "Línea de Crédito",
    field: (row) =>
      row.linea?.name || row.credito_linea?.name || row.linea || "Sin línea",
    sortable: true,
    align: "left",
  },
  {
    name: "asesor",
    label: "Asesor / Sucursal",
    field: (row) =>
      `${row.asesor?.nombreCompleto || ""} ${row.sucursal?.nombre || ""}`,
    sortable: true,
    align: "left",
  },
  {
    name: "monto_solicitado",
    label: "Monto Solicitado",
    field: (row) => row.monto_solicitado || 0,
    sortable: true,
    align: "right",
  },
  {
    name: "estatus",
    label: "Estatus",
    field: (row) => row.estatus?.nombre || "Pendiente",
    sortable: true,
    align: "center",
  },
  {
    name: "vobo_credito",
    label: "VoBo Crédito",
    field: (row) => getVoBoEstatus(row) || "Pendiente",
    sortable: true,
    align: "center",
  },
  {
    name: "vobo_gerencia",
    label: "VoBo Gerencia",
    field: (row) => getVoBoGerenciaEstatus(row) || "Pendiente",
    sortable: true,
    align: "center",
  },
  {
    name: "pagos",
    label: "Progreso de Pagos",
    field: (row) => row.resumen_pagos || "",
    sortable: true,
    align: "left",
  },
  {
    name: "created_at",
    label: "Fecha",
    field: (row) => row.created_at || "",
    sortable: true,
    align: "center",
  },
  {
    name: "detalles",
    label: "Acciones",
    field: (row) => row.id,
    align: "center",
  },
];

const getVoBoEstatus = (row) => {
  return parseVoBoCredito(row).chipLabel;
};

const getVoBoTipo = (row) => {
  return parseVoBoCredito(row).status;
};

const getVoBoGerenciaEstatus = (row) => {
  return parseVoBoGerencia(row).chipLabel;
};

const getVoBoGerenciaTipo = (row) => {
  return parseVoBoGerencia(row).status;
};

const verDetalles = (row) => {
  selectedItem.value = row;
  showDetallesModal.value = true;
};

const verVoBo = (row) => {
  selectedVoBoItem.value = row;
  showVoBoModal.value = true;
};

const verVoBoGerencia = (row) => {
  selectedGerenciaItem.value = row;
  showGerenciaModal.value = true;
};

const verPagos = (row) => {
  selectedPagosItem.value = row;
  showPagosModal.value = true;
};

const verHistorial = (row) => {
  selectedHistorialItem.value = row;
  showHistorialModal.value = true;
};

const onVoBoUpdated = async () => {
  if (catalogoRef.value?.reload) {
    await catalogoRef.value.reload();
  } else {
    await crud.getPaginatedItems("/api/intranet/creditoInternos");
  }
};

const onVoBoGerenciaUpdated = async () => {
  if (catalogoRef.value?.reload) {
    await catalogoRef.value.reload();
  } else {
    await crud.getPaginatedItems("/api/intranet/creditoInternos");
  }
};

const onPagosUpdated = async () => {
  if (catalogoRef.value?.reload) {
    await catalogoRef.value.reload();
  } else {
    await crud.getPaginatedItems("/api/intranet/creditoInternos");
  }
  if (selectedPagosItem.value?.id) {
    const updated = (crud.paginatedItems || []).find(
      (c) => c.id === selectedPagosItem.value.id
    );
    if (updated) {
      selectedPagosItem.value = updated;
    }
  }
};

const getOptions = async () => {
  await crud.getItems("/api/intranet/creditoInternos/options");
  options.value = crud.items || [];
};

onMounted(() => {
  getOptions();
});
</script>
