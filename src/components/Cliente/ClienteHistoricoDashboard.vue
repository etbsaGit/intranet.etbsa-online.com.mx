<template>
  <div class="pbi-dashboard-container q-pa-md">
    <!-- BARRA SUPERIOR DE CONTROL Y BÚSQUEDA -->
    <div class="pbi-header-card q-mb-md">
      <div class="row items-center justify-between q-col-gutter-sm">
        <div class="col-12 col-md-5 row items-center">
          <q-icon name="insights" size="32px" color="red-6" class="q-mr-sm" />
          <div>
            <div class="text-subtitle1 text-weight-bold text-white">
              Radiografía del Cliente
            </div>
            <div class="text-caption text-grey-4">
              Cliente: <span class="text-weight-bold text-yellow-5">{{ currentClienteNombre }}</span>
              <span v-if="dashboardData?.clave_cliente" class="q-ml-xs text-grey-5">
                ({{ dashboardData.clave_cliente }})
              </span>
            </div>
          </div>
        </div>

        <!-- BUSCADOR POR NOMBRE DE CLIENTE -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedClientSearch"
            use-input
            dense
            outlined
            dark
            color="red-5"
            bg-color="dark"
            label="Buscar cliente en el histórico..."
            :options="searchOptions"
            option-label="nombre_cliente"
            option-value="nombre_cliente"
            @filter="filterClientes"
            @update:model-value="onClientSelected"
            clearable
            @clear="resetToCurrentClient"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="red-4" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label class="text-white">{{ scope.opt.nombre_cliente }}</q-item-label>
                  <q-item-label caption class="text-grey-4">
                    {{ scope.opt.total_compras }} registros | {{ formatMoney(scope.opt.total_venta) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <!-- BOTÓN DE SINCRONIZACIÓN Y FECHA -->
        <div class="col-12 col-md-3 text-right row items-center justify-end">
          <div class="text-caption text-grey-4 q-mr-sm text-right" v-if="dashboardData?.last_sync">
            <div style="font-size: 10px;">ÚLTIMA SINCRONIZACIÓN:</div>
            <div class="text-weight-bold text-grey-2" style="font-size: 11px;">{{ dashboardData.last_sync }}</div>
          </div>
          <q-btn
            color="red-7"
            icon="sync"
            label="Sincronizar"
            dense
            no-caps
            class="q-px-sm"
            :loading="syncing"
            @click="syncGoogleSheet"
          >
            <q-tooltip class="bg-dark text-white">
              Descargar y actualizar datos desde la hoja de Google Sheets
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- SPINNER DE CARGA -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-orbit color="red-6" size="60px" />
      <div class="text-grey-3 q-mt-md text-subtitle2">Cargando análisis comercial...</div>
    </div>

    <!-- MENSAJE DE NO ENCONTRADO O SIN VENTAS -->
    <div v-else-if="!dashboardData || !dashboardData.encontrado" class="q-pa-lg text-center bg-dark text-white rounded-borders">
      <q-icon name="folder_off" size="56px" color="orange" class="q-mb-sm" />
      <div class="text-h6 text-weight-bold">Sin compras históricas registradas</div>
      <div class="text-grey-4 q-mt-xs">
        No se encontraron registros de ventas en la base histórica para:
        <span class="text-weight-bold text-white">"{{ currentClienteNombre }}"</span>
      </div>

      <div v-if="dashboardData?.sugerencias?.length" class="q-mt-md">
        <div class="text-caption text-grey-4 q-mb-sm">Coincidencias cercanas encontradas:</div>
        <div class="row justify-center q-gutter-xs">
          <q-chip
            v-for="(sug, sIdx) in dashboardData.sugerencias"
            :key="sIdx"
            clickable
            color="primary"
            text-color="white"
            icon="person"
            @click="loadClienteData(sug)"
          >
            {{ sug }}
          </q-chip>
        </div>
      </div>
    </div>

    <!-- CONTENIDO DEL DASHBOARD -->
    <div v-else class="dashboard-content">
      <!-- BLOQUE 0: TARJETAS EJECUTIVAS PARA TOMA DE DECISIONES Y CRÉDITO -->
      <div v-if="dashboardData?.decision_kpis" class="decision-panel q-mb-lg">
        <!-- BANNER DE DICTAMEN / RECOMENDACIÓN EJECUTIVA -->
        <div class="dictamen-card q-mb-sm row items-center justify-between q-pa-md">
          <div class="col-12 col-md-8 row items-center no-wrap">
            <q-avatar
              :icon="dashboardData.decision_kpis.dictamen.icono"
              size="48px"
              font-size="28px"
              class="q-mr-md shadow-3"
              :style="{ backgroundColor: dashboardData.decision_kpis.dictamen.color + '22', color: dashboardData.decision_kpis.dictamen.color }"
            />
            <div>
              <div class="row items-center q-gutter-x-sm">
                <span class="text-caption text-weight-bolder text-grey-4 tracking-wide">
                  DICTAMEN EJECUTIVO:
                </span>
                <q-badge
                  :color="dashboardData.decision_kpis.dictamen.badge_color"
                  text-color="white"
                  class="text-weight-bolder q-px-sm"
                >
                  {{ dashboardData.decision_kpis.dictamen.nivel }}
                </q-badge>
                <span
                  class="text-subtitle2 text-weight-bolder"
                  :style="{ color: dashboardData.decision_kpis.dictamen.color }"
                >
                  {{ dashboardData.decision_kpis.dictamen.recomendacion }}
                </span>
              </div>
              <div class="text-caption text-grey-3 q-mt-xs leading-tight">
                {{ dashboardData.decision_kpis.dictamen.detalle }}
              </div>
            </div>
          </div>

          <!-- BADGES RESUMEN PERFIL -->
          <div class="col-12 col-md-4 row items-center justify-end q-gutter-xs q-mt-sm-none q-mt-xs">
            <q-chip dense dark color="blue-grey-9" text-color="white" icon="badge">
              <span class="text-weight-bold q-mr-xs">Tipo:</span>
              {{ dashboardData.decision_kpis.tipo_persona }}
            </q-chip>
            <q-chip
              dense
              dark
              :color="dashboardData.decision_kpis.clasificacion_credito.includes('Negra') ? 'red-9' : 'teal-9'"
              text-color="white"
              icon="credit_score"
            >
              <span class="text-weight-bold q-mr-xs">Crédito:</span>
              {{ dashboardData.decision_kpis.clasificacion_credito }}
            </q-chip>
            <q-chip dense dark color="indigo-9" text-color="white" icon="category">
              <span class="text-weight-bold q-mr-xs">Segmento:</span>
              {{ dashboardData.decision_kpis.segmentacion }}
            </q-chip>
          </div>
        </div>

        <!-- GRID DE 4 CUADROS ESTRATÉGICOS -->
        <div class="row q-col-gutter-sm">
          <!-- CUADRO 1: FACTURACIÓN TOTAL HISTÓRICA (¿CUÁNTO NOS HAN COMPRADO?) -->
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="decision-kpi-card h-100">
              <div class="row items-center justify-between q-mb-xs">
                <span class="decision-kpi-title">TOTAL COMPRADO GLOBAL</span>
                <q-icon name="payments" size="22px" color="green-4" />
              </div>
              <div class="decision-kpi-main-val text-green-4">
                {{ formatMoney(dashboardData.decision_kpis.total_comprado_global) }}
              </div>
              <div class="decision-kpi-subcaption text-grey-4 q-mt-xs">
                Consolidado histórico todos los deptos
              </div>
            </div>
          </div>

          <!-- CUADRO 2: COMPRAS RECIENTES (2024 - 2026) -->
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="decision-kpi-card h-100">
              <div class="row items-center justify-between q-mb-xs">
                <span class="decision-kpi-title">COMPRAS RECIENTES (3 AÑOS)</span>
                <q-icon name="trending_up" size="22px" color="light-blue-4" />
              </div>
              <div class="decision-kpi-main-val text-light-blue-4">
                {{ formatMoney(dashboardData.decision_kpis.compras_recientes_3y) }}
              </div>
              <div class="decision-kpi-subcaption text-grey-4 q-mt-xs">
                Periodo 2024, 2025 y 2026
              </div>
              <div class="q-mt-sm decision-breakdown-list">
                <div class="row justify-between text-caption text-grey-4 items-center">
                  <span>Estatus Actividad:</span>
                  <q-badge
                    :color="dashboardData.decision_kpis.compro_en_2026 ? 'positive' : 'grey-7'"
                    text-color="white"
                    dense
                  >
                    {{ dashboardData.decision_kpis.compro_en_2026 ? 'Activo en 2026' : 'Sin compras 2026' }}
                  </q-badge>
                </div>
                <div class="row justify-between text-caption text-grey-4 q-mt-xs">
                  <span>Promedio anual:</span>
                  <span class="text-weight-bold text-white">
                    {{ formatMoney(dashboardData.decision_kpis.promedio_anual) }}/año
                  </span>
                </div>
                <div class="row justify-between text-caption text-grey-4 q-mt-xs">
                  <span>Años con compra:</span>
                  <span class="text-weight-bold text-white">
                    {{ dashboardData.decision_kpis.anios_activo }} años registrados
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- CUADRO 3: RENTABILIDAD Y FIDELIDAD -->
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="decision-kpi-card h-100">
              <div class="row items-center justify-between q-mb-xs">
                <span class="decision-kpi-title">MARGEN & FIDELIDAD</span>
                <q-icon name="stars" size="22px" color="purple-3" />
              </div>
              <div class="decision-kpi-main-val text-purple-3">
                {{ formatMoney(dashboardData.decision_kpis.total_margen_global) }}
              </div>
              <div class="decision-kpi-subcaption text-grey-4 q-mt-xs">
                Ganancia bruta total aportada
              </div>
              <div class="q-mt-sm decision-breakdown-list">
                <div class="row justify-between text-caption text-grey-4 items-center">
                  <span>% Margen global:</span>
                  <q-badge color="purple-9" text-color="white" class="text-weight-bold">
                    {{ dashboardData.decision_kpis.margen_promedio_pct }}% Margen
                  </q-badge>
                </div>
                <div class="row justify-between text-caption text-grey-4 q-mt-xs">
                  <span>Antigüedad de cliente:</span>
                  <span class="text-weight-bold text-yellow-4">
                    {{ dashboardData.decision_kpis.antiguedad_anios }} años
                  </span>
                </div>
                <div class="row justify-between text-caption text-grey-4 q-mt-xs">
                  <span>Primera compra:</span>
                  <span class="text-weight-bold text-white">
                    Año {{ dashboardData.decision_kpis.primera_compra_anio || 'N/A' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- CUADRO 4: SOLICITUDES & ESTATUS DE CRÉDITO -->
          <div class="col-12 col-sm-6 col-lg-3">
            <div
              class="decision-kpi-card h-100"
              :class="{ 'card-highlight-active': dashboardData.decision_kpis.credito_info.solicitud_activa }"
            >
              <div class="row items-center justify-between q-mb-xs">
                <span class="decision-kpi-title">SOLICITUD & CRÉDITO</span>
                <q-icon
                  name="credit_score"
                  size="22px"
                  :color="dashboardData.decision_kpis.credito_info.solicitud_activa ? 'orange-4' : 'teal-4'"
                />
              </div>

              <!-- SI TIENE SOLICITUD ACTIVA EN PROCESO -->
              <template v-if="dashboardData.decision_kpis.credito_info.solicitud_activa">
                <div class="decision-kpi-main-val text-orange-4">
                  {{ formatMoney(dashboardData.decision_kpis.credito_info.solicitud_activa.monto) }}
                </div>
                <div class="row items-center q-mt-xs">
                  <q-badge color="orange-9" text-color="white" class="pulse-badge text-weight-bold">
                    ⏳ En Proceso (#{{ dashboardData.decision_kpis.credito_info.solicitud_activa.folio }})
                  </q-badge>
                </div>
                <div class="q-mt-sm decision-breakdown-list">
                  <div class="row justify-between text-caption text-grey-4">
                    <span>Línea / Plazo:</span>
                    <span class="text-weight-bold text-white">
                      {{ dashboardData.decision_kpis.credito_info.solicitud_activa.linea }} ({{ dashboardData.decision_kpis.credito_info.solicitud_activa.numero_pagos }} pagos)
                    </span>
                  </div>
                  <div class="row justify-between text-caption text-grey-4 q-mt-xs">
                    <span>Enganche propuesto:</span>
                    <span class="text-weight-bold text-white">
                      {{ formatMoney(dashboardData.decision_kpis.credito_info.solicitud_activa.enganche) }}
                    </span>
                  </div>
                  <div class="q-mt-xs text-right">
                    <q-btn
                      flat
                      dense
                      size="xs"
                      color="teal-3"
                      label="Ver solicitudes"
                      icon="visibility"
                      @click="showCreditoListModal = true"
                    />
                  </div>
                </div>
              </template>

              <!-- SI NO TIENE SOLICITUD ACTIVA PERO TIENE HISTORIAL -->
              <template v-else-if="dashboardData.decision_kpis.credito_info.total_solicitudes > 0">
                <div class="decision-kpi-main-val text-teal-4">
                  {{ dashboardData.decision_kpis.credito_info.solicitudes_pagadas }} Pagada(s)
                </div>
                <div class="decision-kpi-subcaption text-grey-4 q-mt-xs">
                  Historial de créditos cumplidos
                </div>
                <div class="q-mt-sm decision-breakdown-list">
                  <div class="row justify-between text-caption text-grey-4">
                    <span>Total solicitado:</span>
                    <span class="text-weight-bold text-white">
                      {{ formatMoney(dashboardData.decision_kpis.credito_info.monto_total_solicitado) }}
                    </span>
                  </div>
                  <div class="row justify-between text-caption text-grey-4 q-mt-xs">
                    <span>Línea aprobada:</span>
                    <span class="text-weight-bold text-green-4">
                      {{ formatMoney(dashboardData.decision_kpis.credito_info.lineas_aprobadas_monto) }}
                    </span>
                  </div>
                  <div class="q-mt-xs text-right">
                    <q-btn
                      flat
                      dense
                      size="xs"
                      color="teal-3"
                      label="Ver solicitudes"
                      icon="history"
                      @click="showCreditoListModal = true"
                    />
                  </div>
                </div>
              </template>

              <!-- SI NO TIENE NINGUNA SOLICITUD DE CRÉDITO -->
              <template v-else>
                <div class="decision-kpi-main-val text-grey-4" style="font-size: 18px;">
                  Sin Solicitudes
                </div>
                <div class="decision-kpi-subcaption text-grey-5 q-mt-xs">
                  No registra créditos internos previos
                </div>
                <div class="q-mt-sm decision-breakdown-list">
                  <div class="row justify-between text-caption text-grey-4">
                    <span>Clasificación:</span>
                    <span class="text-weight-bold text-white">
                      {{ dashboardData.decision_kpis.clasificacion_credito }}
                    </span>
                  </div>
                  <div class="text-caption text-grey-5 q-mt-xs">
                    El cliente no cuenta con deuda ni solicitudes en curso.
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- BLOQUE 1: BANNERS DE VENTA Y MARGEN (COMO IMAGEN 1) -->
      <div class="row q-col-gutter-sm q-mb-md">
        <!-- BANNER DE VENTA -->
        <div class="col-12 col-lg-8">
          <div class="pbi-table-card">
            <div class="pbi-banner-header text-center">VENTA</div>
            <div class="q-pa-xs">
              <div class="row text-center text-caption text-weight-bold pbi-subhdr">
                <div class="col">MAQUINARIA</div>
                <div class="col">REFACCIONES</div>
                <div class="col">SERVICIO</div>
                <div class="col">RIEGO</div>
                <div class="col">CHEVRON</div>
                <div class="col">NUEVAS TEC.</div>
                <div class="col pbi-col-total">TOTAL VENTA</div>
              </div>
              <div class="row text-center text-subtitle2 text-weight-bolder pbi-row-val q-py-sm">
                <div class="col text-white">{{ formatMoney(ventasRadiografia.maquinaria) }}</div>
                <div class="col text-white">{{ formatMoney(ventasRadiografia.refacciones) }}</div>
                <div class="col text-white">{{ formatMoney(ventasRadiografia.servicio) }}</div>
                <div class="col text-white">{{ formatMoney(ventasRadiografia.riego) }}</div>
                <div class="col text-white">{{ formatMoney(ventasRadiografia.chevron) }}</div>
                <div class="col text-white">{{ formatMoney(ventasRadiografia.nuevas_tecnologias) }}</div>
                <div class="col text-yellow-4 pbi-col-total text-weight-bold">
                  {{ formatMoney(ventasRadiografia.total_venta) }}
                </div>
              </div>
            </div>
          </div>

          <!-- BANNER DE MARGEN -->
          <div class="pbi-table-card q-mt-sm">
            <div class="pbi-banner-header text-center">MARGEN</div>
            <div class="q-pa-xs">
              <div class="row text-center text-caption text-weight-bold pbi-subhdr">
                <div class="col">MAQUINARIA</div>
                <div class="col">REFACCIONES</div>
                <div class="col">SERVICIO</div>
                <div class="col">RIEGO</div>
                <div class="col">CHEVRON</div>
                <div class="col">NUEVAS TEC.</div>
                <div class="col pbi-col-total">TOTAL MARGEN</div>
              </div>
              <div class="row text-center text-subtitle2 text-weight-bolder pbi-row-val q-py-sm">
                <div class="col text-white">{{ formatMoney(margenRadiografia.maquinaria) }}</div>
                <div class="col text-white">{{ formatMoney(margenRadiografia.refacciones) }}</div>
                <div class="col text-white">{{ formatMoney(margenRadiografia.servicio) }}</div>
                <div class="col text-white">{{ formatMoney(margenRadiografia.riego) }}</div>
                <div class="col text-white">{{ formatMoney(margenRadiografia.chevron) }}</div>
                <div class="col text-white">{{ formatMoney(margenRadiografia.nuevas_tecnologias) }}</div>
                <div class="col text-green-4 pbi-col-total text-weight-bold">
                  {{ formatMoney(margenRadiografia.total_margen) }}
                  <span class="text-caption text-grey-4" v-if="ventasRadiografia.total_venta > 0">
                    ({{ calcMargenPct(margenRadiografia.total_margen, ventasRadiografia.total_venta) }}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- TABLA DESGLOSE VENTA POR DEPARTAMENTO / SUCURSAL (DEBAJO DE MARGEN) -->
          <div class="desglose-depto-card q-mt-sm">
            <div class="desglose-banner-header text-center text-weight-bold">
              Desglose Venta por Departamento
            </div>
            <div class="pbi-table-wrap">
              <table class="pbi-desglose-table">
                <thead>
                  <tr>
                    <th class="text-left th-sucursal">SUCURSAL</th>
                    <th class="text-right">MAQUINARIA</th>
                    <th class="text-right">REFACCIONES</th>
                    <th class="text-right">SERVICIO</th>
                    <th class="text-right">RIEGO</th>
                    <th class="text-right">CHEVRON</th>
                    <th class="text-right">NUEVAS TECNOLOGIAS</th>
                    <th class="text-right th-total">TOTAL VENTA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rIdx) in desgloseSucursalDepto" :key="rIdx">
                    <td class="text-left text-weight-bold sucursal-col">{{ row.sucursal }}</td>
                    <td class="text-right">{{ formatMoneyInt(row.venta_maquinaria) }}</td>
                    <td class="text-right">{{ formatMoneyInt(row.venta_refacciones) }}</td>
                    <td class="text-right">{{ formatMoneyInt(row.venta_servicio) }}</td>
                    <td class="text-right">{{ formatMoneyInt(row.venta_riego) }}</td>
                    <td class="text-right">{{ formatMoneyInt(row.venta_chevron) }}</td>
                    <td class="text-right">{{ formatMoneyInt(row.venta_nuevas_tecnologias) }}</td>
                    <td class="text-right text-weight-bold total-col">{{ formatMoneyInt(row.total_venta) }}</td>
                  </tr>
                  <tr v-if="!desgloseSucursalDepto.length">
                    <td colspan="8" class="text-center text-grey-5 q-pa-md">
                      Sin registros de ventas por sucursal
                    </td>
                  </tr>
                </tbody>
                <tfoot v-if="desgloseSucursalDepto.length">
                  <tr class="desglose-total-row">
                    <td class="total-blank-cell"></td>
                    <td class="text-right">{{ formatMoneyInt(totalDesglose.maquinaria) }}</td>
                    <td class="text-right">{{ formatMoneyInt(totalDesglose.refacciones) }}</td>
                    <td class="text-right">{{ formatMoneyInt(totalDesglose.servicio) }}</td>
                    <td class="text-right">{{ formatMoneyInt(totalDesglose.riego) }}</td>
                    <td class="text-right">{{ formatMoneyInt(totalDesglose.chevron) }}</td>
                    <td class="text-right">{{ formatMoneyInt(totalDesglose.nuevas_tecnologias) }}</td>
                    <td class="text-right text-weight-bolder">{{ formatMoneyInt(totalDesglose.total_venta) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- TARJETAS LATERALES DE KPIS (CLIENTES, EQUIPOS, AÑOS) -->
        <div class="col-12 col-lg-4">
          <div class="row q-col-gutter-xs">
            <div class="col-6">
              <div class="kpi-box text-center">
                <div class="row items-center justify-center q-gutter-x-xs q-mb-xs">
                  <q-icon name="agriculture" size="20px" color="green-4">
                    <q-tooltip>Tractor / Maquinaria</q-tooltip>
                  </q-icon>
                  <q-icon name="water_drop" size="18px" color="cyan-4">
                    <q-tooltip>Riego</q-tooltip>
                  </q-icon>
                  <q-icon name="hardware" size="18px" color="orange-4">
                    <q-tooltip>Implemento</q-tooltip>
                  </q-icon>
                  <q-icon name="flight" size="18px" color="purple-4">
                    <q-tooltip>Dron</q-tooltip>
                  </q-icon>
                  <q-icon name="gps_fixed" size="18px" color="blue-4">
                    <q-tooltip>GPS</q-tooltip>
                  </q-icon>
                </div>
                <div class="text-h6 text-weight-bold text-white q-mt-xs">
                  {{ dashboardData.kpis.total_unidades }}
                </div>
                <div class="text-caption text-grey-4">VENTAS REGISTRADAS</div>
              </div>
            </div>
            <div class="col-6">
              <div class="kpi-box text-center">
                <q-icon name="percent" size="28px" color="blue-4" />
                <div class="text-h6 text-weight-bold text-white q-mt-xs">
                  {{ dashboardData.kpis.margen_pct }}%
                </div>
                <div class="text-caption text-grey-4">% MARGEN GLOBAL</div>
              </div>
            </div>
            <div class="col-6">
              <div class="kpi-box text-center q-mt-xs">
                <q-icon name="event" size="28px" color="amber-4" />
                <div class="text-h6 text-weight-bold text-white q-mt-xs">
                  {{ dashboardData.kpis.primera_compra || 'N/A' }}
                </div>
                <div class="text-caption text-grey-4">PRIMERA COMPRA</div>
              </div>
            </div>
            <div class="col-6">
              <div class="kpi-box text-center q-mt-xs">
                <q-icon name="verified" size="28px" color="purple-4" />
                <div class="text-h6 text-weight-bold text-white q-mt-xs">
                  {{ dashboardData.kpis.ultima_compra || 'N/A' }}
                </div>
                <div class="text-caption text-grey-4">ÚLTIMA COMPRA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BLOQUE 3: TABLAS ANALÍTICAS (VENTA POR CATEGORÍA Y FAMILIAS - IMÁGENES 3 Y 4) -->
      <div class="row q-col-gutter-sm q-mb-md">
        <!-- VENTA POR CATEGORÍA -->
        <div class="col-12 col-md-6">
          <div class="pbi-table-card">
            <div class="pbi-table-header">Venta por Categoria</div>
            <div class="pbi-table-wrap">
              <table class="pbi-table">
                <thead>
                  <tr>
                    <th class="text-left">CATEGORIA</th>
                    <th class="text-right">UNIDADES</th>
                    <th class="text-right">PRECIO VENTA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rIdx) in dashboardData.venta_categoria" :key="rIdx">
                    <td class="text-left">{{ row.categoria }}</td>
                    <td class="text-right text-grey-3">{{ row.unidades }}</td>
                    <td class="text-right text-weight-bold">{{ formatMoney(row.precio_venta) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="pbi-total-row">
                    <td class="text-left">TOTAL</td>
                    <td class="text-right">{{ sumCol(dashboardData.venta_categoria, 'unidades') }}</td>
                    <td class="text-right">{{ formatMoney(sumCol(dashboardData.venta_categoria, 'precio_venta')) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- TRACTORES POR FAMILIA -->
        <div class="col-12 col-md-6">
          <div class="pbi-table-card">
            <div class="pbi-table-header">Tractores por Familia</div>
            <div class="pbi-table-wrap">
              <table class="pbi-table">
                <thead>
                  <tr>
                    <th class="text-left">CLASIFICACIÓN</th>
                    <th class="text-right">UNIDADES</th>
                    <th class="text-right">PRECIO VENTA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rIdx) in dashboardData.tractores_familia" :key="rIdx">
                    <td class="text-left">{{ row.clave }}</td>
                    <td class="text-right text-grey-3">{{ row.unidades }}</td>
                    <td class="text-right text-weight-bold">{{ formatMoney(row.precio_venta) }}</td>
                  </tr>
                  <tr v-if="!dashboardData.tractores_familia.length">
                    <td colspan="3" class="text-center text-grey-5 q-pa-sm">Sin compras de tractores</td>
                  </tr>
                </tbody>
                <tfoot v-if="dashboardData.tractores_familia.length">
                  <tr class="pbi-total-row">
                    <td class="text-left">TOTAL</td>
                    <td class="text-right">{{ sumCol(dashboardData.tractores_familia, 'unidades') }}</td>
                    <td class="text-right">{{ formatMoney(sumCol(dashboardData.tractores_familia, 'precio_venta')) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- BLOQUE 4: TABLAS DE DESGLOSE SECUNDARIAS (IMAGEN 4) -->
      <div class="row q-col-gutter-sm q-mb-md">
        <!-- TRACTORES POR MODELO -->
        <div class="col-12 col-md-6 col-lg-4" v-if="dashboardData.tractores_modelo.length">
          <div class="pbi-table-card">
            <div class="pbi-table-header">Tractores por Modelo</div>
            <div class="pbi-table-wrap scroll-table">
              <table class="pbi-table">
                <thead>
                  <tr>
                    <th class="text-left">MODELO</th>
                    <th class="text-right">UNIDADES</th>
                    <th class="text-right">PRECIO VENTA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rIdx) in dashboardData.tractores_modelo" :key="rIdx">
                    <td class="text-left">{{ row.clave }}</td>
                    <td class="text-right text-grey-3">{{ row.unidades }}</td>
                    <td class="text-right">{{ formatMoney(row.precio_venta) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="pbi-total-row">
                    <td class="text-left">TOTAL</td>
                    <td class="text-right">{{ sumCol(dashboardData.tractores_modelo, 'unidades') }}</td>
                    <td class="text-right">{{ formatMoney(sumCol(dashboardData.tractores_modelo, 'precio_venta')) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- IMPLEMENTOS JD -->
        <div class="col-12 col-md-6 col-lg-4" v-if="dashboardData.implementos_jd.length">
          <div class="pbi-table-card">
            <div class="pbi-table-header">Implementos JD</div>
            <div class="pbi-table-wrap scroll-table">
              <table class="pbi-table">
                <thead>
                  <tr>
                    <th class="text-left">CLASIFICACIÓN</th>
                    <th class="text-right">UNIDADES</th>
                    <th class="text-right">PRECIO VENTA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rIdx) in dashboardData.implementos_jd" :key="rIdx">
                    <td class="text-left">{{ row.clave }}</td>
                    <td class="text-right text-grey-3">{{ row.unidades }}</td>
                    <td class="text-right">{{ formatMoney(row.precio_venta) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="pbi-total-row">
                    <td class="text-left">TOTAL</td>
                    <td class="text-right">{{ sumCol(dashboardData.implementos_jd, 'unidades') }}</td>
                    <td class="text-right">{{ formatMoney(sumCol(dashboardData.implementos_jd, 'precio_venta')) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- IMPLEMENTOS DIVERSA -->
        <div class="col-12 col-md-6 col-lg-4" v-if="dashboardData.implementos_diversa.length">
          <div class="pbi-table-card">
            <div class="pbi-table-header">Implementos Diversa</div>
            <div class="pbi-table-wrap scroll-table">
              <table class="pbi-table">
                <thead>
                  <tr>
                    <th class="text-left">CLASIFICACIÓN</th>
                    <th class="text-right">UNIDADES</th>
                    <th class="text-right">PRECIO VENTA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rIdx) in dashboardData.implementos_diversa" :key="rIdx">
                    <td class="text-left">{{ row.clave }}</td>
                    <td class="text-right text-grey-3">{{ row.unidades }}</td>
                    <td class="text-right">{{ formatMoney(row.precio_venta) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="pbi-total-row">
                    <td class="text-left">TOTAL</td>
                    <td class="text-right">{{ sumCol(dashboardData.implementos_diversa, 'unidades') }}</td>
                    <td class="text-right">{{ formatMoney(sumCol(dashboardData.implementos_diversa, 'precio_venta')) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>


        <!-- JARDINERÍA Y GOLF -->
        <div class="col-12 col-md-6 col-lg-4" v-if="dashboardData.jardineria.length">
          <div class="pbi-table-card">
            <div class="pbi-table-header">Jardineria y Golf</div>
            <div class="pbi-table-wrap scroll-table">
              <table class="pbi-table">
                <thead>
                  <tr>
                    <th class="text-left">CLASIFICACIÓN</th>
                    <th class="text-right">UNIDADES</th>
                    <th class="text-right">PRECIO VENTA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rIdx) in dashboardData.jardineria" :key="rIdx">
                    <td class="text-left">{{ row.clave }}</td>
                    <td class="text-right text-grey-3">{{ row.unidades }}</td>
                    <td class="text-right">{{ formatMoney(row.precio_venta) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="pbi-total-row">
                    <td class="text-left">TOTAL</td>
                    <td class="text-right">{{ sumCol(dashboardData.jardineria, 'unidades') }}</td>
                    <td class="text-right">{{ formatMoney(sumCol(dashboardData.jardineria, 'precio_venta')) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- NUEVAS TECNOLOGÍAS -->
        <div class="col-12 col-md-6 col-lg-4" v-if="dashboardData.nuevas_tecnologias.length">
          <div class="pbi-table-card">
            <div class="pbi-table-header">Nuevas Tecnologias</div>
            <div class="pbi-table-wrap scroll-table">
              <table class="pbi-table">
                <thead>
                  <tr>
                    <th class="text-left">CLASIFICACIÓN</th>
                    <th class="text-right">UNIDADES</th>
                    <th class="text-right">PRECIO VENTA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rIdx) in dashboardData.nuevas_tecnologias" :key="rIdx">
                    <td class="text-left">{{ row.clave }}</td>
                    <td class="text-right text-grey-3">{{ row.unidades }}</td>
                    <td class="text-right">{{ formatMoney(row.precio_venta) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="pbi-total-row">
                    <td class="text-left">TOTAL</td>
                    <td class="text-right">{{ sumCol(dashboardData.nuevas_tecnologias, 'unidades') }}</td>
                    <td class="text-right">{{ formatMoney(sumCol(dashboardData.nuevas_tecnologias, 'precio_venta')) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- BLOQUE 5: LISTADO DETALLADO DE FACTURAS Y EQUIPOS -->
      <div class="pbi-table-card q-mt-md">
        <div class="pbi-table-header row items-center justify-between">
          <div class="row items-center">
            <q-icon name="receipt_long" class="q-mr-sm" size="20px" />
            <span>HISTORIAL DETALLADO DE EQUIPOS Y FACTURAS</span>
          </div>
          <div class="text-caption text-grey-3">
            {{ dashboardData.facturas.length }} registros
          </div>
        </div>

        <div class="q-pa-sm">
          <q-table
            flat
            dark
            bordered
            dense
            :rows="dashboardData.facturas"
            :columns="facturaColumns"
            row-key="id"
            :filter="facturasFilter"
            :pagination="{ rowsPerPage: 10 }"
            class="facturas-table"
          >
            <template v-slot:top-right>
              <q-input
                v-model="facturasFilter"
                dense
                dark
                outlined
                color="red-5"
                placeholder="Filtrar por NIP, modelo, factura..."
              >
                <template v-slot:append>
                  <q-icon name="search" color="grey-4" />
                </template>
              </q-input>
            </template>

            <template v-slot:body-cell-nip="props">
              <q-td :props="props">
                <span class="text-weight-bold text-grey-2" style="font-family: monospace; font-size: 11.5px;">
                  {{ props.row.nip || '-' }}
                </span>
              </q-td>
            </template>

            <template v-slot:body-cell-precio_venta="props">
              <q-td :props="props" class="text-weight-bold text-yellow-4">
                {{ formatMoney(props.row.precio_venta) }}
              </q-td>
            </template>

            <template v-slot:body-cell-margen="props">
              <q-td :props="props" class="text-weight-bold text-green-4">
                {{ formatMoney(props.row.margen) }}
                <span class="text-caption text-grey-4">({{ props.row.margen_pct }}%)</span>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>

      <!-- BLOQUE 6: TENDENCIAS ANUALES POR DEPARTAMENTO (GRÁFICAS DE LÍNEA) -->
      <ClienteHistoricoTendencias
        :tendencias="dashboardData.tendencias_anuales"
      />
    </div>

    <!-- MODAL DE HISTORIAL DE SOLICITUDES DE CRÉDITO -->
    <q-dialog v-model="showCreditoListModal" dark>
      <q-card class="bg-dark text-white" style="min-width: 650px; max-width: 850px;">
        <q-card-section class="row items-center justify-between bg-primary q-py-sm">
          <div class="text-subtitle1 text-weight-bold row items-center">
            <q-icon name="history" size="22px" class="q-mr-sm" />
            Historial de Solicitudes de Crédito: {{ currentClienteNombre }}
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-table
            flat
            bordered
            dark
            dense
            :rows="dashboardData?.decision_kpis?.credito_info?.solicitudes_list || []"
            :columns="solicitudColumns"
            row-key="folio"
            no-data-label="No hay solicitudes registradas"
          >
            <template v-slot:body-cell-estatus="props">
              <q-td :props="props" class="text-center">
                <q-badge
                  :style="{ backgroundColor: props.row.estatus_color || '#00e676', color: '#000000' }"
                  class="text-weight-bold"
                >
                  {{ props.row.estatus }}
                </q-badge>
              </q-td>
            </template>
            <template v-slot:body-cell-monto="props">
              <q-td :props="props" class="text-weight-bold text-yellow-4">
                {{ formatMoney(props.row.monto) }}
              </q-td>
            </template>
            <template v-slot:body-cell-enganche="props">
              <q-td :props="props" class="text-weight-bold text-white">
                {{ formatMoney(props.row.enganche) }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { api } from "src/boot/axios";
import { formatCurrency } from "src/boot/format";
import { Notify } from "quasar";
import ClienteHistoricoTendencias from "src/components/Cliente/ClienteHistoricoTendencias.vue";

const props = defineProps({
  cliente: {
    type: Object,
    default: () => ({}),
  },
});

const loading = ref(false);
const syncing = ref(false);
const dashboardData = ref(null);
const currentClienteNombre = ref("");
const selectedClientSearch = ref(null);
const searchOptions = ref([]);
const facturasFilter = ref("");
const showCreditoListModal = ref(false);

const ventasRadiografia = computed(() => {
  if (dashboardData.value?.ventas_radiografia) {
    return dashboardData.value.ventas_radiografia;
  }
  const anual = dashboardData.value?.tendencias_anuales || [];
  const maq = anual.reduce((acc, c) => acc + (Number(c.venta_maquinaria) || 0), 0);
  const refac = anual.reduce((acc, c) => acc + (Number(c.venta_refacciones) || 0), 0);
  const serv = anual.reduce((acc, c) => acc + (Number(c.venta_servicio) || 0), 0);
  const riego = anual.reduce((acc, c) => acc + (Number(c.venta_riego) || 0), 0);
  const chev = anual.reduce((acc, c) => acc + (Number(c.venta_chevron) || 0), 0);
  const nt = anual.reduce((acc, c) => acc + (Number(c.venta_nuevas_tecnologias) || 0), 0);
  const total = anual.reduce((acc, c) => acc + (Number(c.total_venta) || 0), 0) || (maq + refac + serv + riego + chev + nt);

  return {
    maquinaria: maq,
    refacciones: refac,
    servicio: serv,
    riego: riego,
    chevron: chev,
    nuevas_tecnologias: nt,
    total_venta: total,
  };
});

const margenRadiografia = computed(() => {
  if (dashboardData.value?.margen_radiografia) {
    return dashboardData.value.margen_radiografia;
  }
  const anual = dashboardData.value?.tendencias_anuales || [];
  const maq = anual.reduce((acc, c) => acc + (Number(c.margen_maquinaria) || 0), 0);
  const refac = anual.reduce((acc, c) => acc + (Number(c.margen_refacciones) || 0), 0);
  const serv = anual.reduce((acc, c) => acc + (Number(c.margen_servicio) || 0), 0);
  const riego = anual.reduce((acc, c) => acc + (Number(c.margen_riego) || 0), 0);
  const chev = anual.reduce((acc, c) => acc + (Number(c.margen_chevron) || 0), 0);
  const nt = anual.reduce((acc, c) => acc + (Number(c.margen_nuevas_tecnologias) || 0), 0);
  const total = anual.reduce((acc, c) => acc + (Number(c.total_margen) || 0), 0) || (maq + refac + serv + riego + chev + nt);

  return {
    maquinaria: maq,
    refacciones: refac,
    servicio: serv,
    riego: riego,
    chevron: chev,
    nuevas_tecnologias: nt,
    total_margen: total,
  };
});

const solicitudColumns = [
  { name: "folio", label: "Folio", field: "folio", align: "left" },
  { name: "fecha", label: "Fecha", field: "fecha", align: "left" },
  { name: "linea", label: "Línea", field: "linea", align: "left" },
  { name: "monto", label: "Monto Solicitado", field: "monto", align: "right" },
  { name: "enganche", label: "Enganche", field: "enganche", align: "right" },
  { name: "estatus", label: "Estatus", field: "estatus", align: "center" },
];

const facturaColumns = [
  { name: "fecha_factura", label: "Fecha", field: "fecha_factura", align: "left", sortable: true },
  { name: "nip", label: "NIP", field: "nip", align: "left", sortable: true },
  { name: "sucursal", label: "Sucursal", field: "sucursal", align: "left", sortable: true },
  { name: "categoria", label: "Categoría", field: "categoria", align: "left", sortable: true },
  { name: "clasificacion", label: "Familia/Clasif.", field: "clasificacion", align: "left", sortable: true },
  { name: "modelo", label: "Modelo", field: "modelo", align: "left", sortable: true },
  { name: "descripcion_producto", label: "Descripción", field: "descripcion_producto", align: "left", sortable: true },
  { name: "precio_venta", label: "Precio Venta", field: "precio_venta", align: "right", sortable: true },
  { name: "margen", label: "Margen", field: "margen", align: "right", sortable: true },
];

const desgloseSucursalDepto = computed(() => {
  return dashboardData.value?.desglose_sucursal_depto || [];
});

const totalDesglose = computed(() => {
  const rows = desgloseSucursalDepto.value || [];
  return {
    maquinaria: rows.reduce((acc, r) => acc + (Number(r.venta_maquinaria) || 0), 0),
    refacciones: rows.reduce((acc, r) => acc + (Number(r.venta_refacciones) || 0), 0),
    servicio: rows.reduce((acc, r) => acc + (Number(r.venta_servicio) || 0), 0),
    riego: rows.reduce((acc, r) => acc + (Number(r.venta_riego) || 0), 0),
    chevron: rows.reduce((acc, r) => acc + (Number(r.venta_chevron) || 0), 0),
    nuevas_tecnologias: rows.reduce((acc, r) => acc + (Number(r.venta_nuevas_tecnologias) || 0), 0),
    total_venta: rows.reduce((acc, r) => acc + (Number(r.total_venta) || 0), 0),
  };
});

const formatMoney = (val) => {
  return formatCurrency(val || 0);
};

const formatMoneyInt = (val) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(val || 0));
};

const calcMargenPct = (margen, venta) => {
  if (!venta || venta <= 0) return 0;
  return ((margen / venta) * 100).toFixed(1);
};

const calcSucursalPct = (venta) => {
  const total = dashboardData.value?.kpis?.total_venta || 1;
  return total > 0 ? Math.min(1, Math.max(0, venta / total)) : 0;
};

const getVentaByDepto = (deptoKeyword) => {
  if (!dashboardData.value?.por_departamento) return 0;
  const match = dashboardData.value.por_departamento.filter((d) =>
    (d.departamento || "").toUpperCase().includes(deptoKeyword.toUpperCase())
  );
  return match.reduce((acc, curr) => acc + (curr.venta || 0), 0);
};

const getMargenByDepto = (deptoKeyword) => {
  if (!dashboardData.value?.por_departamento) return 0;
  const match = dashboardData.value.por_departamento.filter((d) =>
    (d.departamento || "").toUpperCase().includes(deptoKeyword.toUpperCase())
  );
  return match.reduce((acc, curr) => acc + (curr.margen || 0), 0);
};

const getVentaByCategoria = (catKeyword) => {
  if (!dashboardData.value?.venta_categoria) return 0;
  const match = dashboardData.value.venta_categoria.filter((c) =>
    (c.categoria || "").toUpperCase() === catKeyword.toUpperCase()
  );
  return match.reduce((acc, curr) => acc + (curr.precio_venta || 0), 0);
};

const getMargenByCategoria = (catKeyword) => {
  if (!dashboardData.value?.venta_categoria) return 0;
  const match = dashboardData.value.venta_categoria.filter((c) =>
    (c.categoria || "").toUpperCase() === catKeyword.toUpperCase()
  );
  return match.reduce((acc, curr) => acc + (curr.margen || 0), 0);
};

const sumCol = (arr, key) => {
  if (!arr || !Array.isArray(arr)) return 0;
  return arr.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
};

const loadClienteData = async (nombreCliente) => {
  if (!nombreCliente) return;
  loading.value = true;
  try {
    const res = await api.get("/api/intranet/historico-ventas/cliente", {
      params: { nombre: nombreCliente, cliente_id: props.cliente?.id },
    });
    dashboardData.value = res.data;
    if (res.data?.nombre_cliente) {
      currentClienteNombre.value = res.data.nombre_cliente;
    } else {
      currentClienteNombre.value = nombreCliente;
    }
  } catch (error) {
    console.error("Error al obtener histórico comercial:", error);
    Notify.create({
      type: "negative",
      message: "No se pudo cargar el análisis comercial del cliente.",
    });
  } finally {
    loading.value = false;
  }
};

const filterClientes = async (val, update) => {
  if (val.length < 2) {
    update(() => {
      searchOptions.value = [];
    });
    return;
  }
  try {
    const res = await api.get("/api/intranet/historico-ventas/search-clientes", {
      params: { term: val },
    });
    update(() => {
      searchOptions.value = res.data;
    });
  } catch (err) {
    console.error("Error buscando clientes:", err);
    update(() => {
      searchOptions.value = [];
    });
  }
};

const onClientSelected = (val) => {
  if (val && val.nombre_cliente) {
    loadClienteData(val.nombre_cliente);
  }
};

const resetToCurrentClient = () => {
  currentClienteNombre.value = props.cliente?.nombre || "";
  loadClienteData(currentClienteNombre.value);
};

const syncGoogleSheet = async () => {
  syncing.value = true;
  Notify.create({
    type: "info",
    message: "Sincronizando con Google Sheets, por favor espera...",
    timeout: 3000,
  });
  try {
    const res = await api.post("/api/intranet/historico-ventas/sync");
    if (res.data?.success) {
      Notify.create({
        type: "positive",
        message: "¡Base de datos actualizada con éxito!",
      });
      loadClienteData(currentClienteNombre.value);
    } else {
      Notify.create({
        type: "negative",
        message: res.data?.message || "Error al sincronizar con Google Sheets.",
      });
    }
  } catch (error) {
    console.error("Error en sincronización:", error);
    Notify.create({
      type: "negative",
      message: "Error de conexión al sincronizar.",
    });
  } finally {
    syncing.value = false;
  }
};

onMounted(() => {
  currentClienteNombre.value = props.cliente?.nombre || "";
  loadClienteData(currentClienteNombre.value);
});

watch(
  () => props.cliente,
  (newVal) => {
    if (newVal && newVal.nombre) {
      currentClienteNombre.value = newVal.nombre;
      loadClienteData(newVal.nombre);
    }
  }
);
</script>

<style scoped>
.pbi-dashboard-container {
  background-color: #0b111e;
  min-height: 80vh;
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  border-radius: 8px;
}

.pbi-header-card {
  background: linear-gradient(135deg, #161f30 0%, #1e293b 100%);
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 12px 16px;
}

.pbi-table-card {
  background-color: #131b29;
  border: 1px solid #233044;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.pbi-banner-header {
  background: linear-gradient(90deg, #991b1b 0%, #b91c1c 50%, #991b1b 100%);
  color: white;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 1px;
  padding: 6px 10px;
}

.pbi-table-header {
  background: linear-gradient(90deg, #991b1b 0%, #b91c1c 100%);
  color: white;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  padding: 6px 12px;
}

.pbi-subhdr {
  background-color: #0f172a;
  color: #94a3b8;
  padding: 6px 0;
  border-bottom: 1px solid #1e293b;
}

.pbi-row-val {
  background-color: #162032;
}

.pbi-col-total {
  background-color: #241618;
  border-left: 1px solid #451a1a;
}

.kpi-box {
  background: linear-gradient(135deg, #131b29 0%, #1a2436 100%);
  border: 1px solid #28374d;
  border-radius: 6px;
  padding: 12px 8px;
  height: 100%;
}

.sucursal-bar-card {
  background-color: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 4px;
}

.pbi-table-wrap {
  overflow-x: auto;
}

.scroll-table {
  max-height: 260px;
  overflow-y: auto;
}

.pbi-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.pbi-table th {
  background-color: #0f172a;
  color: #cbd5e1;
  font-weight: 700;
  padding: 6px 10px;
  border-bottom: 1px solid #334155;
}

.pbi-table td {
  padding: 5px 10px;
  border-bottom: 1px solid #1a2436;
  color: #f1f5f9;
}

.pbi-table tbody tr:hover {
  background-color: #1e293b;
}

.pbi-total-row td {
  background-color: #7f1d1d !important;
  color: #ffffff !important;
  font-weight: 800 !important;
  border-top: 2px solid #b91c1c;
}

.facturas-table {
  background-color: #0f172a;
}

/* ==========================================================================
   ESTILOS PARA EL PANEL DE DECISIÓN COMERCIAL Y CRÉDITO
   ========================================================================== */
.decision-panel {
  border-radius: 8px;
}

.dictamen-card {
  background: linear-gradient(135deg, #0e1726 0%, #172338 100%);
  border: 1px solid #28374d;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

.decision-kpi-card {
  background: linear-gradient(135deg, #10192a 0%, #152238 100%);
  border: 1px solid #23334d;
  border-radius: 8px;
  padding: 14px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.decision-kpi-card:hover {
  border-color: #38bdf8;
  transform: translateY(-2px);
}

.card-highlight-active {
  border-color: #f97316 !important;
  box-shadow: 0 0 15px rgba(249, 115, 22, 0.25) !important;
}

.decision-kpi-title {
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.decision-kpi-main-val {
  font-size: 22px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.3px;
}

.decision-kpi-subcaption {
  font-size: 11px;
}

.decision-breakdown-list {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 8px;
}

.pulse-badge {
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% {
    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(249, 115, 22, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
  }
}

/* ==========================================================================
   ESTILOS TABLA: DESGLOSE VENTA POR DEPARTAMENTO (SUCURSAL Y DEPARTAMENTOS)
   ========================================================================== */
.desglose-depto-card {
  border: 1px solid #1e293b;
  border-radius: 4px;
  overflow: hidden;
  background-color: #000000;
}

.desglose-banner-header {
  background-color: #8b151e;
  color: #ffffff;
  padding: 8px 16px;
  font-size: 15px;
  letter-spacing: 0.3px;
}

.pbi-desglose-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.pbi-desglose-table th {
  background-color: #000000;
  color: #ffffff;
  font-style: italic;
  font-weight: 800;
  padding: 8px 12px;
  border-right: 1px solid #334155;
  border-bottom: 2px solid #2563eb;
  letter-spacing: 0.5px;
}

.pbi-desglose-table th:last-child {
  border-right: none;
}

.pbi-desglose-table td {
  padding: 8px 12px;
  color: #ffffff;
  border-right: 1px solid #1e293b;
  border-bottom: 1px solid #1e293b;
  background-color: #0b111e;
}

.pbi-desglose-table tbody tr:hover td {
  background-color: #162032;
}

.pbi-desglose-table td:last-child {
  border-right: none;
}

.pbi-desglose-table td.sucursal-col {
  color: #ffffff;
  font-weight: 700;
}

.desglose-total-row td {
  background-color: #8b151e !important;
  color: #ffffff !important;
  font-weight: 800 !important;
  border-top: 1px solid #a91b22;
  border-right: 1px solid #a91b22;
  border-bottom: none;
  font-size: 13.5px;
}

.desglose-total-row td:last-child {
  border-right: none;
}

.desglose-total-row td.total-blank-cell {
  background-color: #ffffff !important;
  border-right: 1px solid #334155;
}
</style>
