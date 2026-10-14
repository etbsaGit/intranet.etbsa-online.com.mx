<template>
  <div class="q-pa-sm text-white cartera-vencida-container">
    <!-- ENCABEZADO DEL DASHBOARD -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6 text-weight-bold text-red-5 flex items-center q-gutter-x-sm">
          <q-icon name="account_balance_wallet" size="28px" />
          <span>CARTERA VENCIDA</span>
        </div>
        <div class="text-caption text-grey-4">
          Antigüedad de saldos y vencimientos por cliente
        </div>
      </div>

      <!-- BOTÓN DE RECARGA / SINCRONIZAR Y FECHA -->
      <div class="row items-center q-gutter-x-sm">
        <div class="text-right text-caption text-grey-4 q-mr-xs" v-if="carteraData?.last_sync">
          <div style="font-size: 10px;">Última sincronización:</div>
          <div class="text-weight-bold text-grey-2" style="font-size: 11px;">
            {{ carteraData.last_sync }}
          </div>
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

    <!-- SPINNER DE CARGA -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-orbit color="red-6" size="60px" />
      <div class="text-grey-3 q-mt-md text-subtitle2">Cargando datos de cartera vencida...</div>
    </div>

    <!-- MENSAJE DE NO ENCONTRADO O SIN CARTERA -->
    <div
      v-else-if="!carteraData || !carteraData.encontrado"
      class="q-pa-lg text-center bg-dark text-white rounded-borders"
    >
      <q-icon name="task_alt" size="56px" color="positive" class="q-mb-sm" />
      <div class="text-h6 text-weight-bold text-positive">Sin cartera vencida registrada</div>
      <div class="text-grey-4 q-mt-xs">
        No se encontraron saldos ni adeudos pendientes en la base de cartera para:
        <span class="text-weight-bold text-white">"{{ currentClienteNombre }}"</span>
        <span v-if="props.cliente?.equip" class="text-grey-5 q-ml-xs">
          (EQUIP: {{ props.cliente.equip }})
        </span>
      </div>
    </div>

    <!-- CONTENIDO DEL DASHBOARD -->
    <div v-else class="cartera-content">
      <!-- BADGES INFORMATIVOS DEL MATCH Y FOLIOS -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="row items-center q-gutter-xs">
          <q-badge color="grey-9" text-color="white" class="q-px-sm q-py-xs">
            <q-icon name="person" size="14px" class="q-mr-xs" />
            <span class="text-weight-bold">{{ carteraData.cliente_nombre }}</span>
          </q-badge>
          <q-badge
            v-if="selectedDepto !== 'TODOS'"
            color="amber-10"
            text-color="amber-2"
            class="q-px-sm q-py-xs"
          >
            <q-icon name="filter_alt" size="13px" class="q-mr-xs" />
            Depto: {{ selectedDepto }}
          </q-badge>
        </div>

        <div class="text-caption text-grey-4">
          <span class="text-weight-bold text-white">{{ filteredTotales?.total_documentos || 0 }}</span>
          folio(s) en cartera
          <span v-if="selectedDepto !== 'TODOS'" class="text-amber-3">
            (filtrado de {{ carteraData.totales?.total_documentos || 0 }})
          </span>
        </div>
      </div>

      <!-- BARRA DE FILTRO INTERACTIVO POR DEPARTAMENTO -->
      <div class="filter-bar q-pa-sm q-mb-md rounded-borders row items-center justify-between">
        <div class="row items-center q-gutter-x-sm q-my-xs">
          <div class="row items-center q-gutter-x-xs text-amber-4 text-weight-bolder text-caption" style="letter-spacing: 0.5px;">
            <q-icon name="tune" size="18px" />
            <span>DEPARTAMENTO:</span>
          </div>

          <!-- BOTONES / CHIPS RÁPIDOS DE FILTRADO -->
          <div class="row items-center q-gutter-xs">
            <q-chip
              clickable
              dense
              :color="selectedDepto === 'TODOS' ? 'amber-8' : 'grey-9'"
              :text-color="selectedDepto === 'TODOS' ? 'dark' : 'grey-3'"
              class="text-weight-bold cursor-pointer"
              @click="selectedDepto = 'TODOS'"
            >
              Todos ({{ carteraData.totales?.total_documentos || 0 }})
            </q-chip>
            <q-chip
              v-for="d in availableDeptos"
              :key="d.nombre"
              clickable
              dense
              :color="selectedDepto === d.nombre ? 'amber-8' : 'grey-9'"
              :text-color="selectedDepto === d.nombre ? 'dark' : 'grey-3'"
              class="text-weight-bold cursor-pointer"
              @click="selectedDepto = d.nombre"
            >
              {{ d.nombre }}
              <q-badge
                color="dark"
                text-color="amber-3"
                class="q-ml-xs text-bold"
                style="font-size: 10px;"
                v-if="d.foliosCount > 0"
              >
                {{ d.foliosCount }}
              </q-badge>
            </q-chip>
          </div>
        </div>

        <!-- SELECT DESPLEGABLE ALTERNATIVO -->
        <div class="row items-center q-gutter-x-sm q-my-xs" style="min-width: 230px; max-width: 320px;">
          <q-select
            v-model="selectedDepto"
            :options="deptoSelectOptions"
            dense
            outlined
            dark
            emit-value
            map-options
            color="amber-4"
            class="full-width"
            bg-color="dark"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="amber-4" size="18px" />
            </template>
          </q-select>
        </div>
      </div>

      <!-- TARJETAS SUPERIORES TIPO KPI -->
      <div class="row q-col-gutter-sm q-mb-md">
        <!-- CARTERA TOTAL -->
        <div class="col-12 col-sm-6 col-md-3">
          <div class="kpi-box text-center">
            <q-icon name="account_balance_wallet" size="26px" color="amber-4" />
            <div class="text-h6 text-weight-bold text-amber-3 q-mt-xs">
              {{ formatMoneyInt(filteredTotales?.cartera_total) }}
            </div>
            <div class="text-caption text-grey-4">
              CARTERA TOTAL{{ selectedDepto !== 'TODOS' ? ' (' + selectedDepto + ')' : '' }}
            </div>
          </div>
        </div>

        <!-- TOTAL VENCIDO -->
        <div class="col-12 col-sm-6 col-md-3">
          <div class="kpi-box text-center">
            <q-icon name="warning" size="26px" color="red-4" />
            <div class="text-h6 text-weight-bold text-red-4 q-mt-xs">
              {{ formatMoneyInt(filteredTotales?.total_vencido) }}
            </div>
            <div class="text-caption text-grey-4">TOTAL VENCIDO</div>
          </div>
        </div>

        <!-- POR VENCER -->
        <div class="col-12 col-sm-6 col-md-3">
          <div class="kpi-box text-center">
            <q-icon name="schedule" size="26px" color="cyan-4" />
            <div class="text-h6 text-weight-bold text-cyan-3 q-mt-xs">
              {{ formatMoneyInt(filteredTotales?.por_vencer) }}
            </div>
            <div class="text-caption text-grey-4">POR VENCER</div>
          </div>
        </div>

        <!-- % DE CARTERA EN MORA -->
        <div class="col-12 col-sm-6 col-md-3">
          <div class="kpi-box text-center">
            <q-icon name="pie_chart" size="26px" color="purple-4" />
            <div class="text-h6 text-weight-bold text-purple-3 q-mt-xs">
              {{ filteredPctVencido }}%
            </div>
            <div class="text-caption text-grey-4">% EN MORA</div>
          </div>
        </div>
      </div>

      <!-- TABLA PRINCIPAL: CARTERA VENCIDA ETBSA (DISEÑO IDÉNTICO A LA IMAGEN) -->
      <div class="cartera-table-card q-mb-md">
        <!-- HEADER ROJO SUPERIOR -->
        <div class="cartera-banner-header text-center text-weight-bolder">
          CARTERA VENCIDA ETBSA{{ selectedDepto !== 'TODOS' ? ' - ' + selectedDepto.toUpperCase() : '' }}
        </div>

        <!-- TABLA -->
        <div class="cartera-table-wrap">
          <table class="cartera-etbsa-table">
            <thead>
              <tr>
                <th class="text-left th-cliente">Cliente</th>
                <th class="text-right">MAS DE 90</th>
                <th class="text-right">MAS DE 60</th>
                <th class="text-right">MAS DE 30</th>
                <th class="text-right">MAS DE 15</th>
                <th class="text-right">DE 1 Y 15 DIAS</th>
                <th class="text-right">POR VENCER</th>
                <th class="text-right th-highlight">TOTAL VENCIDO</th>
                <th class="text-right th-total">CARTERA TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left text-weight-bold td-cliente">
                  {{ filteredTotales?.cliente }}
                  <span v-if="selectedDepto !== 'TODOS'" class="text-caption text-amber-3 q-ml-xs">
                    ({{ selectedDepto }})
                  </span>
                </td>
                <td
                  class="text-right"
                  :class="{ 'text-red-4 text-weight-bolder': (filteredTotales?.mas_de_90 || 0) > 0 }"
                >
                  {{ formatMoneyInt(filteredTotales?.mas_de_90) }}
                </td>
                <td class="text-right">{{ formatMoneyInt(filteredTotales?.mas_de_60) }}</td>
                <td class="text-right">{{ formatMoneyInt(filteredTotales?.mas_de_30) }}</td>
                <td class="text-right">{{ formatMoneyInt(filteredTotales?.mas_de_15) }}</td>
                <td class="text-right">{{ formatMoneyInt(filteredTotales?.de_1_a_15) }}</td>
                <td class="text-right">{{ formatMoneyInt(filteredTotales?.por_vencer) }}</td>
                <td class="text-right text-weight-bold td-vencido">
                  {{ formatMoneyInt(filteredTotales?.total_vencido) }}
                </td>
                <td class="text-right text-weight-bold td-cartera-total">
                  {{ formatMoneyInt(filteredTotales?.cartera_total) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="cartera-total-row">
                <td class="text-left text-weight-bolder">Total</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(filteredTotales?.mas_de_90) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(filteredTotales?.mas_de_60) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(filteredTotales?.mas_de_30) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(filteredTotales?.mas_de_15) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(filteredTotales?.de_1_a_15) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(filteredTotales?.por_vencer) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(filteredTotales?.total_vencido) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(filteredTotales?.cartera_total) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- SECCIÓN DE GRÁFICAS DE PASTEL: DEUDA POR SUCURSAL Y POR DEPARTAMENTO -->
      <div class="row q-col-gutter-sm q-mb-md">
        <!-- GRÁFICA 1: DEUDA POR SUCURSAL -->
        <div class="col-12 col-md-6">
          <div class="chart-box">
            <div class="chart-header-row row items-center justify-between q-pa-sm">
              <div class="row items-center q-gutter-x-xs">
                <q-icon name="storefront" size="20px" color="teal-4" />
                <span class="text-subtitle2 text-weight-bold text-white">
                  DEUDA POR SUCURSAL{{ selectedDepto !== 'TODOS' ? ' (' + selectedDepto + ')' : '' }}
                </span>
              </div>
              <span class="text-caption text-grey-4 text-weight-bold">
                {{ formatMoneyInt(filteredTotales?.cartera_total) }}
              </span>
            </div>
            <div class="q-pa-sm flex flex-center" style="min-height: 290px;">
              <apexchart
                v-if="sucursalSeries.length > 0 && sucursalTotalSum > 0"
                type="pie"
                width="100%"
                height="280"
                :options="sucursalChartOptions"
                :series="sucursalSeries"
              />
              <div v-else class="text-grey-5 text-center q-pa-md">
                Sin datos de deuda por sucursal{{ selectedDepto !== 'TODOS' ? ' para ' + selectedDepto : '' }}
              </div>
            </div>
          </div>
        </div>

        <!-- GRÁFICA 2: DEUDA POR DEPARTAMENTO -->
        <div class="col-12 col-md-6">
          <div class="chart-box">
            <div class="chart-header-row row items-center justify-between q-pa-sm">
              <div class="row items-center q-gutter-x-xs">
                <q-icon name="category" size="20px" color="cyan-4" />
                <span class="text-subtitle2 text-weight-bold text-white">DEUDA POR DEPARTAMENTO</span>
              </div>
              <span class="text-caption text-grey-4 text-weight-bold">
                {{ formatMoneyInt(carteraData.totales?.cartera_total) }}
              </span>
            </div>
            <div class="q-pa-sm flex flex-center" style="min-height: 290px;">
              <apexchart
                v-if="deptoSeries.length > 0 && deptoTotalSum > 0"
                type="pie"
                width="100%"
                height="280"
                :options="deptoChartOptions"
                :series="deptoSeries"
              />
              <div v-else class="text-grey-5 text-center q-pa-md">
                Sin datos de deuda por departamento
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TABLA: ANTIGÜEDAD DE CARTERA POR DEPARTAMENTO -->
      <div class="cartera-table-card q-mb-md" v-if="deptoData.length">
        <div class="cartera-banner-header text-center text-weight-bolder row items-center justify-between">
          <div class="row items-center q-gutter-x-xs">
            <q-icon name="category" size="18px" />
            <span>ANTIGÜEDAD DE CARTERA POR DEPARTAMENTO</span>
          </div>
          <span class="text-caption text-weight-regular" style="font-size: 11px;">
            (Clic en un departamento para filtrar)
          </span>
        </div>
        <div class="cartera-table-wrap">
          <table class="cartera-etbsa-table">
            <thead>
              <tr>
                <th class="text-left th-cliente">DEPARTAMENTO</th>
                <th class="text-right">MAS DE 90</th>
                <th class="text-right">MAS DE 60</th>
                <th class="text-right">MAS DE 30</th>
                <th class="text-right">MAS DE 15</th>
                <th class="text-right">DE 1 Y 15 DIAS</th>
                <th class="text-right">POR VENCER</th>
                <th class="text-right th-highlight">TOTAL VENCIDO</th>
                <th class="text-right th-total">CARTERA TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(dep, dIdx) in deptoData"
                :key="dIdx"
                class="cursor-pointer row-hover-depto"
                :class="{ 'row-active-depto': selectedDepto === dep.depto }"
                @click="toggleDepto(dep.depto)"
              >
                <td class="text-left text-weight-bold td-cliente">
                  <div class="row items-center q-gutter-x-xs">
                    <q-icon
                      :name="selectedDepto === dep.depto ? 'radio_button_checked' : 'radio_button_unchecked'"
                      size="14px"
                      :color="selectedDepto === dep.depto ? 'amber-4' : 'grey-6'"
                    />
                    <span>{{ dep.depto }}</span>
                    <span class="text-caption text-grey-5" v-if="dep.total_documentos">
                      ({{ dep.total_documentos }} folio{{ dep.total_documentos > 1 ? 's' : '' }})
                    </span>
                  </div>
                </td>
                <td
                  class="text-right"
                  :class="{ 'text-red-4 text-weight-bolder': (dep.mas_de_90 || 0) > 0 }"
                >
                  {{ formatMoneyInt(dep.mas_de_90) }}
                </td>
                <td class="text-right">{{ formatMoneyInt(dep.mas_de_60) }}</td>
                <td class="text-right">{{ formatMoneyInt(dep.mas_de_30) }}</td>
                <td class="text-right">{{ formatMoneyInt(dep.mas_de_15) }}</td>
                <td class="text-right">{{ formatMoneyInt(dep.de_1_a_15) }}</td>
                <td class="text-right">{{ formatMoneyInt(dep.por_vencer) }}</td>
                <td class="text-right text-weight-bold td-vencido">
                  {{ formatMoneyInt(dep.total_vencido) }}
                </td>
                <td class="text-right text-weight-bold td-cartera-total">
                  {{ formatMoneyInt(dep.total) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="cartera-total-row">
                <td class="text-left text-weight-bolder">Total Departamentos</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.mas_de_90) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.mas_de_60) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.mas_de_30) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.mas_de_15) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.de_1_a_15) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.por_vencer) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.total_vencido) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.cartera_total) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- SECCIÓN DESPLEGABLE: DETALLE DE FOLIOS / FACTURAS -->
      <q-expansion-item
        v-if="filteredDetalles?.length"
        dense
        dense-toggle
        expand-separator
        icon="receipt_long"
        :label="`Ver desglose detallado de folios y facturas (${filteredDetalles.length}${selectedDepto !== 'TODOS' ? ' en ' + selectedDepto : ''})`"
        header-class="text-weight-bold text-grey-3 bg-dark-card rounded-borders"
        class="q-mt-sm"
      >
        <div class="q-pa-xs q-mt-xs">
          <q-table
            flat
            bordered
            dark
            dense
            :rows="filteredDetalles"
            :columns="detalleColumns"
            row-key="id"
            hide-pagination
            :pagination="{ rowsPerPage: 0 }"
            class="detalle-table-scroll"
          >
            <template v-slot:body="props">
              <q-tr
                :props="props"
                :class="{ 'row-vencido-90': (props.row.mas_de_90 || 0) > 0 }"
              >
                <q-td key="folio" :props="props" class="text-left font-mono">
                  <q-badge
                    v-if="(props.row.mas_de_90 || 0) > 0"
                    color="red-10"
                    text-color="white"
                    class="q-mr-xs text-weight-bold"
                    label="+90 días"
                  />
                  {{ props.row.folio }}
                </q-td>
                <q-td key="sucursal" :props="props">{{ props.row.sucursal }}</q-td>
                <q-td key="depto" :props="props">{{ props.row.depto }}</q-td>
                <q-td key="fecha_vencimiento" :props="props" class="text-center">{{ props.row.fecha_vencimiento }}</q-td>
                <q-td
                  key="mas_de_90"
                  :props="props"
                  class="text-right"
                  :class="(props.row.mas_de_90 || 0) > 0 ? 'text-red-4 text-weight-bolder td-mas90-cell' : 'text-grey-6'"
                >
                  {{ formatMoneyInt(props.row.mas_de_90) }}
                </q-td>
                <q-td key="mas_de_60" :props="props" class="text-right">{{ formatMoneyInt(props.row.mas_de_60) }}</q-td>
                <q-td key="mas_de_30" :props="props" class="text-right">{{ formatMoneyInt(props.row.mas_de_30) }}</q-td>
                <q-td key="mas_de_15" :props="props" class="text-right">{{ formatMoneyInt(props.row.mas_de_15) }}</q-td>
                <q-td key="de_1_a_15" :props="props" class="text-right">{{ formatMoneyInt(props.row.de_1_a_15) }}</q-td>
                <q-td key="por_vencer" :props="props" class="text-right">{{ formatMoneyInt(props.row.por_vencer) }}</q-td>
                <q-td key="total_vencido" :props="props" class="text-right text-weight-bold text-red-4">
                  {{ formatMoneyInt(props.row.total_vencido) }}
                </q-td>
                <q-td key="cartera_total" :props="props" class="text-right text-weight-bold text-yellow-4">
                  {{ formatMoneyInt(props.row.cartera_total) }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-expansion-item>

      <!-- SECCIÓN: ANÁLISIS DE CRÉDITO Y PAGOS (GRÁFICAS Y KPIS) -->
      <div class="q-mt-xl q-mb-md" v-if="filteredAnalisisCreditoPagos">
        <!-- ENCABEZADO DE LA SECCIÓN DE ANÁLISIS -->
        <div class="row items-center justify-between q-mb-sm">
          <div class="row items-center q-gutter-x-sm">
            <q-icon name="insights" size="26px" color="amber-4" />
            <span class="text-subtitle1 text-weight-bolder text-white">
              ANÁLISIS DE CARTERA VENCIDA Y ABONOS REALIZADOS{{ selectedDepto !== 'TODOS' ? ' (' + selectedDepto + ')' : '' }}
            </span>
          </div>
          <div class="text-caption text-grey-4">
            Comparativa de folios en cartera vencida vs abonos recibidos en ingresos
          </div>
        </div>

        <!-- TARJETAS KPIS DE CRÉDITO Y PAGOS -->
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- TOTAL DEUDA EN CARTERA -->
          <div class="col-12 col-sm-4">
            <div class="kpi-box text-center">
              <q-icon name="receipt_long" size="24px" color="amber-4" />
              <div class="text-h6 text-weight-bold text-amber-3 q-mt-xs">
                {{ formatMoneyInt(filteredAnalisisCreditoPagos.cartera_deuda_total) }}
              </div>
              <div class="text-caption text-grey-4">DEUDA CARTERA VENCIDA</div>
              <div class="text-caption text-grey-5" style="font-size: 11px;">
                Columna Total ({{ filteredAnalisisCreditoPagos.total_folios_cartera }} folios)
              </div>
            </div>
          </div>

          <!-- TOTAL ABONADO A ESTOS FOLIOS -->
          <div class="col-12 col-sm-4">
            <div class="kpi-box text-center">
              <q-icon name="payments" size="24px" color="green-4" />
              <div class="text-h6 text-weight-bold text-green-4 q-mt-xs">
                {{ formatMoneyInt(filteredAnalisisCreditoPagos.pagos_total) }}
              </div>
              <div class="text-caption text-grey-4">ABONADO A ESTOS FOLIOS</div>
              <div class="text-caption text-green-3 text-weight-bold" style="font-size: 11px;">
                {{ filteredAnalisisCreditoPagos.porcentaje_pagado }}% abonado de la deuda
              </div>
            </div>
          </div>

          <!-- SALDO PENDIENTE REAL -->
          <div class="col-12 col-sm-4">
            <div class="kpi-box text-center">
              <q-icon name="warning" size="24px" color="red-4" />
              <div class="text-h6 text-weight-bold text-red-4 q-mt-xs">
                {{ formatMoneyInt(filteredAnalisisCreditoPagos.saldo_pendiente_real) }}
              </div>
              <div class="text-caption text-grey-4">SALDO PENDIENTE REAL</div>
              <div class="text-caption text-red-3 text-weight-bold" style="font-size: 11px;">
                {{ filteredAnalisisCreditoPagos.porcentaje_pendiente }}% pendiente por liquidar
              </div>
            </div>
          </div>
        </div>

        <!-- GRÁFICA 1: BALANCE GENERAL DE CRÉDITO Y SALDOS -->
        <div class="chart-box q-mb-md">
          <div class="chart-header-row row items-center justify-between q-pa-sm">
            <div class="row items-center q-gutter-x-xs">
              <q-icon name="bar_chart" size="20px" color="blue-4" />
              <span class="text-subtitle2 text-weight-bold text-white">
                BALANCE GENERAL DE CRÉDITO Y SALDOS
              </span>
            </div>
            <q-badge color="grey-9" text-color="grey-3">
              {{ selectedDepto === 'TODOS' ? 'General' : selectedDepto }}
            </q-badge>
          </div>
          <div class="q-pa-sm" style="min-height: 180px;">
            <apexchart
              v-if="generalChartSeries.length"
              type="bar"
              width="100%"
              height="180"
              :options="generalChartOptions"
              :series="generalChartSeries"
            />
          </div>
        </div>

        <!-- GRÁFICA 2: COMPARATIVA: LO QUE SE DEBE VS LO ABONADO (POR CLIENTE) -->
        <div class="chart-box q-mb-md">
          <!-- CABECERA DE LA COMPARATIVA CON CONTROLES -->
          <div class="chart-header-row row items-center justify-between q-pa-sm">
            <div class="row items-center q-gutter-x-xs">
              <q-icon name="balance" size="22px" color="amber-4" />
              <div>
                <span class="text-subtitle1 text-weight-bold text-white">
                  COMPARATIVA: LO QUE SE DEBE VS LO ABONADO
                </span>
                <span v-if="selectedDepto !== 'TODOS'" class="text-caption text-amber-3 q-ml-sm">
                  ({{ selectedDepto }})
                </span>
              </div>
            </div>

            <!-- FILTROS Y CONTROLES DIRECTOS EN LA TARJETA -->
            <div class="row items-center q-gutter-x-xs">
              <!-- SELECTOR DE DEPARTAMENTO -->
              <q-select
                v-model="selectedDepto"
                :options="deptoSelectOptions"
                dense
                outlined
                dark
                emit-value
                map-options
                color="amber-4"
                options-dense
                style="min-width: 160px; max-width: 230px;"
                bg-color="dark"
              >
                <template v-slot:prepend>
                  <q-icon name="tune" size="16px" color="amber-4" />
                </template>
              </q-select>

              <!-- TOGGLE FILTRO DE AÑO (SI HAY MÁS DE UN AÑO REGISTRADO) -->
              <q-btn-toggle
                v-if="periodoFiltro === 'mes' && availableClienteAnos.length > 1"
                v-model="filtroClienteAno"
                dense
                no-caps
                rounded
                unelevated
                toggle-color="amber-8"
                color="grey-9"
                text-color="grey-4"
                toggle-text-color="dark"
                size="sm"
                :options="[
                  { label: 'Todos', value: 'todos' },
                  ...availableClienteAnos.map(a => ({ label: a, value: a }))
                ]"
              />

              <!-- TOGGLE POR MES / POR AÑO -->
              <q-btn-toggle
                v-model="periodoFiltro"
                dense
                no-caps
                rounded
                unelevated
                toggle-color="positive"
                color="grey-9"
                text-color="grey-4"
                toggle-text-color="white"
                size="sm"
                :options="[
                  { label: 'Por Mes', value: 'mes' },
                  { label: 'Por Año', value: 'ano' },
                ]"
              />
            </div>
          </div>

          <!-- RESUMEN / KPIS DEL PERIODO FILTRADO DEL CLIENTE -->
          <div class="row q-col-gutter-sm q-pa-sm" style="background: rgba(0,0,0,0.25); border-bottom: 1px solid #1e293b;">
            <div class="col-6 col-sm-3">
              <div class="kpi-mini-box q-pa-xs text-center">
                <div class="text-caption text-amber-4 text-weight-bold">LO QUE SE DEBE</div>
                <div class="text-h6 text-weight-bolder text-amber-4">
                  {{ formatMoneyInt(totalDebePeriodo) }}
                </div>
                <div class="text-caption text-grey-5" style="font-size: 10px;">Cartera Vencida (Col. Total)</div>
              </div>
            </div>

            <div class="col-6 col-sm-3">
              <div class="kpi-mini-box q-pa-xs text-center">
                <div class="text-caption text-green-4 text-weight-bold">LO ABONADO</div>
                <div class="text-h6 text-weight-bolder text-green-4">
                  {{ formatMoneyInt(totalAbonadoPeriodo) }}
                </div>
                <div class="text-caption text-grey-5" style="font-size: 10px;">A estos folios (Pagos Cobranza)</div>
              </div>
            </div>

            <div class="col-6 col-sm-3">
              <div class="kpi-mini-box q-pa-xs text-center">
                <div class="text-caption text-blue-3 text-weight-bold">SALDO PENDIENTE</div>
                <div class="text-h6 text-weight-bolder text-blue-4">
                  {{ formatMoneyInt(totalDebePeriodo - totalAbonadoPeriodo) }}
                </div>
                <div class="text-caption text-grey-5" style="font-size: 10px;">Diferencia neta</div>
              </div>
            </div>

            <div class="col-6 col-sm-3">
              <div class="kpi-mini-box q-pa-xs text-center">
                <div class="text-caption text-purple-3 text-weight-bold">% COBRADO</div>
                <div class="text-h6 text-weight-bolder text-purple-3">
                  {{ pctCobradoPeriodo }}%
                </div>
                <div class="text-caption text-grey-5" style="font-size: 10px;">
                  {{ filteredAnalisisCreditoPagos?.total_folios_cartera || 0 }} folios de cartera
                </div>
              </div>
            </div>
          </div>

          <!-- GRÁFICA DE BARRAS DEL CLIENTE (AMPLIA Y NÍTIDA) -->
          <div class="q-pa-sm" style="min-height: 330px;">
            <apexchart
              v-if="evolucionSeries.length"
              type="bar"
              width="100%"
              height="330"
              :options="evolucionChartOptions"
              :series="evolucionSeries"
            />
            <div v-else class="text-center text-grey-5 q-pa-lg">
              No hay movimientos registrados para este cliente en el periodo o departamento seleccionado.
            </div>
          </div>

          <!-- TABLA MENSUAL DE VALORES DEL CLIENTE (DIRECTA EN EL DASHBOARD) -->
          <div class="cartera-table-card q-ma-sm" v-if="clientComparativaItems.length">
            <div class="cartera-banner-header text-center text-weight-bolder" style="background: linear-gradient(90deg, #92400e 0%, #b45309 100%);">
              TABLA DE VALORES {{ periodoFiltro === 'ano' ? 'POR AÑO' : 'POR MES' }} — {{ currentClienteNombre }}
            </div>
            <div class="cartera-table-wrap">
              <table class="cartera-etbsa-table">
                <thead>
                  <tr>
                    <th style="width: 44px;" class="text-center"></th>
                    <th class="text-left">Periodo</th>
                    <th class="text-right text-amber-4">Lo que se Debe</th>
                    <th class="text-right text-green-4">Lo Abonado</th>
                    <th class="text-right">Diferencia</th>
                    <th class="text-center">% Cobrado</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="item in clientComparativaItems" :key="item.periodo">
                    <tr
                      class="row-periodo-parent"
                      :class="{ 'row-periodo-active': expandedPeriodos[item.periodo] }"
                      @click="togglePeriodo(item.periodo)"
                    >
                      <td class="text-center" style="width: 44px; padding: 4px;">
                        <q-btn
                          flat
                          dense
                          round
                          size="sm"
                          color="amber-4"
                          :icon="expandedPeriodos[item.periodo] ? 'keyboard_arrow_down' : 'keyboard_arrow_right'"
                          @click.stop="togglePeriodo(item.periodo)"
                        >
                          <q-tooltip>{{ expandedPeriodos[item.periodo] ? 'Ocultar folios' : 'Desplegar folios de ' + item.label }}</q-tooltip>
                        </q-btn>
                      </td>
                      <td class="text-left text-weight-bold font-mono">
                        {{ item.label }}
                        <q-badge
                          v-if="item.folios && item.folios.length"
                          outline
                          color="amber-4"
                          class="q-ml-sm"
                          style="font-size: 10.5px; padding: 1px 6px;"
                        >
                          <q-icon name="receipt" size="11px" class="q-mr-xs" />
                          {{ item.folios.length }} {{ item.folios.length === 1 ? 'folio' : 'folios' }}
                        </q-badge>
                      </td>
                      <td class="text-right text-amber-4 text-weight-bold">{{ formatMoneyInt(item.deuda) }}</td>
                      <td class="text-right text-green-4 text-weight-bold">{{ item.abonos > 0 ? formatMoneyInt(item.abonos) : '-' }}</td>
                      <td class="text-right text-weight-bold" :class="item.saldo > 0 ? 'text-red-4' : 'text-green-3'">
                        {{ formatMoneyInt(item.saldo) }}
                      </td>
                      <td class="text-center">
                        <q-badge
                          dense
                          :color="item.deuda > 0 && Number(item.pct) >= 50 ? 'positive' : item.abonos > 0 ? 'amber-9' : 'grey-8'"
                          :label="item.deuda > 0 ? item.pct + '%' : (item.abonos > 0 ? '100%' : '0%')"
                        />
                      </td>
                    </tr>

                    <!-- SUB-FILA DESPLEGABLE CON EL DESGLOSE DE FOLIOS -->
                    <tr v-if="expandedPeriodos[item.periodo]" class="row-periodo-desglose">
                      <td colspan="6" class="q-pa-none">
                        <div class="desglose-folios-container">
                          <div class="desglose-folios-header row items-center justify-between q-px-sm q-py-xs">
                            <div class="text-caption text-weight-bold text-amber-3 flex items-center">
                              <q-icon name="receipt_long" size="15px" class="q-mr-xs" />
                              Desglose de Folios — {{ item.label }} ({{ item.folios ? item.folios.length : 0 }} registros)
                            </div>
                            <div class="text-caption text-grey-4" style="font-size: 11px;">
                              Deuda: <strong class="text-amber-3 font-mono q-mr-sm">{{ formatMoneyInt(item.deuda) }}</strong>
                              Abonos: <strong class="text-green-4 font-mono q-mr-sm">{{ formatMoneyInt(item.abonos) }}</strong>
                              Diferencia: <strong :class="item.saldo > 0 ? 'text-red-4 font-mono' : 'text-green-3 font-mono'">{{ formatMoneyInt(item.saldo) }}</strong>
                            </div>
                          </div>

                          <div v-if="!item.folios || !item.folios.length" class="text-center text-grey-5 q-pa-sm text-caption">
                            No hay folios individuales registrados para este periodo.
                          </div>

                          <div v-else class="subtable-scroll-wrap">
                            <table class="subtable-folios">
                              <thead>
                                <tr>
                                  <th class="text-left">Folio</th>
                                  <th class="text-left">Depto</th>
                                  <th class="text-left">Sucursal</th>
                                  <th class="text-left">Fecha Venc / Pago</th>
                                  <th class="text-right text-amber-3">Lo que se Debe</th>
                                  <th class="text-right text-green-3">Lo Abonado</th>
                                  <th class="text-right">Diferencia</th>
                                  <th class="text-center">Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="f in item.folios" :key="f.folio">
                                  <td class="text-left text-weight-bold font-mono text-amber-2">
                                    {{ f.folio }}
                                  </td>
                                  <td class="text-left text-caption text-grey-4">
                                    {{ f.depto || '-' }}
                                  </td>
                                  <td class="text-left text-caption text-grey-4">
                                    {{ f.sucursal || '-' }}
                                  </td>
                                  <td class="text-left text-caption text-grey-4 font-mono">
                                    {{ f.fecha || '-' }}
                                  </td>
                                  <td class="text-right text-amber-4 font-mono text-weight-medium">
                                    {{ f.deuda > 0 ? formatMoneyInt(f.deuda) : '-' }}
                                  </td>
                                  <td class="text-right text-green-4 font-mono text-weight-medium">
                                    {{ f.abonos > 0 ? formatMoneyInt(f.abonos) : '-' }}
                                  </td>
                                  <td class="text-right font-mono text-weight-bold" :class="f.saldo > 0 ? 'text-red-4' : (f.saldo < 0 ? 'text-cyan-3' : 'text-green-3')">
                                    {{ formatMoneyInt(f.saldo) }}
                                  </td>
                                  <td class="text-center">
                                    <q-badge
                                      dense
                                      v-if="f.deuda > 0 && f.abonos >= f.deuda"
                                      color="positive"
                                      label="Liquidado"
                                    />
                                    <q-badge
                                      dense
                                      v-else-if="f.abonos > 0 && f.deuda > 0"
                                      color="amber-9"
                                      :label="f.pct + '%'"
                                    />
                                    <q-badge
                                      dense
                                      v-else-if="f.abonos > 0 && f.deuda <= 0"
                                      color="blue-8"
                                      label="Abono a favor"
                                    />
                                    <q-badge
                                      dense
                                      v-else
                                      color="red-9"
                                      label="Pendiente"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
                <tfoot>
                  <tr class="cartera-total-row">
                    <td colspan="2" class="text-left text-weight-bolder">Total</td>
                    <td class="text-right text-amber-4 text-weight-bolder">{{ formatMoneyInt(totalDebePeriodo) }}</td>
                    <td class="text-right text-green-4 text-weight-bolder">{{ formatMoneyInt(totalAbonadoPeriodo) }}</td>
                    <td class="text-right text-weight-bolder" :class="(totalDebePeriodo - totalAbonadoPeriodo) > 0 ? 'text-red-4' : 'text-green-3'">
                      {{ formatMoneyInt(totalDebePeriodo - totalAbonadoPeriodo) }}
                    </td>
                    <td class="text-center text-weight-bolder">
                      <q-badge
                        :color="Number(pctCobradoPeriodo) >= 50 ? 'positive' : Number(pctCobradoPeriodo) > 0 ? 'amber-9' : 'red-9'"
                        text-color="white"
                        class="text-weight-bold"
                      >
                        {{ pctCobradoPeriodo }}%
                      </q-badge>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- TABLA DETALLE INGRESOS (SEGUNDA FUENTE DE GOOGLE SHEETS) -->
      <div class="cartera-table-card q-mt-md q-mb-md" v-if="filteredIngresosItems.length">
        <div class="cartera-banner-header text-center text-weight-bolder">
          DETALLE INGRESOS{{ selectedDepto !== 'TODOS' ? ' - ' + selectedDepto.toUpperCase() : '' }} — FOLIOS EN CARTERA VENCIDA ({{ filteredIngresosItems.length }} registros)
        </div>
        <div class="cartera-table-wrap detalle-table-scroll">
          <table class="cartera-etbsa-table">
            <thead>
              <tr>
                <th class="text-center" style="min-width: 90px;">ID_Cliente</th>
                <th class="text-left th-cliente" style="min-width: 180px;">CLIENTE</th>
                <th class="text-left" style="min-width: 140px;">DEPARTAMENTO</th>
                <th class="text-center" style="min-width: 60px;">Año</th>
                <th class="text-center" style="min-width: 80px;">Mes</th>
                <th class="text-center" style="min-width: 50px;">Dia</th>
                <th class="text-center" style="min-width: 90px;">FOLIO</th>
                <th class="text-left" style="min-width: 220px;">Descripcion</th>
                <th class="text-right" style="min-width: 110px;">CREDITO</th>
                <th class="text-right" style="min-width: 100px;">CONTADO</th>
                <th class="text-right" style="min-width: 110px;">NOTA DEBITO</th>
                <th class="text-right" style="min-width: 110px;">NOTA CREDITO</th>
                <th class="text-right" style="min-width: 130px;">PAGOS COBRANZA</th>
                <th class="text-right" style="min-width: 130px;">PAGOS MOSTRADOR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in filteredIngresosItems" :key="idx">
                <td class="text-center font-mono">{{ item.id_cliente }}</td>
                <td class="text-left text-weight-medium td-cliente">{{ item.cliente }}</td>
                <td class="text-left">
                  <q-badge color="grey-9" text-color="amber-3" class="q-px-xs">
                    {{ item.depto }}
                  </q-badge>
                </td>
                <td class="text-center">{{ item.ano }}</td>
                <td class="text-center text-lowercase">{{ item.mes }}</td>
                <td class="text-center">{{ item.dia }}</td>
                <td class="text-center font-mono text-weight-bold">{{ item.folio }}</td>
                <td class="text-left">{{ item.descripcion }}</td>
                <td class="text-right">{{ formatCellMoney(item.credito) }}</td>
                <td class="text-right">{{ formatCellMoney(item.contado) }}</td>
                <td class="text-right">{{ formatCellMoney(item.nota_debito) }}</td>
                <td class="text-right">{{ formatCellMoney(item.nota_credito) }}</td>
                <td class="text-right">{{ formatCellMoney(item.pagos_cobranza) }}</td>
                <td class="text-right">{{ formatCellMoney(item.pagos_mostrador) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="cartera-total-row">
                <td colspan="8" class="text-left text-weight-bolder" style="padding-left: 20px;">
                  Total
                </td>
                <td class="text-right text-weight-bolder">
                  {{ formatCellMoney(filteredIngresosTotales?.credito) }}
                </td>
                <td class="text-right text-weight-bolder">
                  {{ formatCellMoney(filteredIngresosTotales?.contado) }}
                </td>
                <td class="text-right text-weight-bolder">
                  {{ formatCellMoney(filteredIngresosTotales?.nota_debito) }}
                </td>
                <td class="text-right text-weight-bolder">
                  {{ formatCellMoney(filteredIngresosTotales?.nota_credito) }}
                </td>
                <td class="text-right text-weight-bolder">
                  {{ formatCellMoney(filteredIngresosTotales?.pagos_cobranza) }}
                </td>
                <td class="text-right text-weight-bolder">
                  {{ formatCellMoney(filteredIngresosTotales?.pagos_mostrador) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import apexchart from "vue3-apexcharts";
import { api } from "src/boot/axios";
import { formatCurrency } from "src/boot/format";
import { Notify } from "quasar";

const props = defineProps({
  cliente: {
    type: Object,
    default: () => ({}),
  },
});

const loading = ref(false);
const syncing = ref(false);
const carteraData = ref(null);

const currentClienteNombre = computed(() => {
  return (
    props.cliente?.nombre_completo ||
    props.cliente?.nombre ||
    props.cliente?.razon_social ||
    ""
  );
});

// --- FILTRADO INTERACTIVO POR DEPARTAMENTO ---
const selectedDepto = ref("TODOS");

// Departamentos disponibles obtenidos de Carátula e Ingresos
const availableDeptos = computed(() => {
  const map = {};
  (carteraData.value?.detalles || []).forEach((d) => {
    const dep = (d.depto || "").trim();
    if (dep) {
      if (!map[dep]) map[dep] = { nombre: dep, foliosCount: 0, ingresosCount: 0 };
      map[dep].foliosCount++;
    }
  });
  (carteraData.value?.ingresos?.items || []).forEach((i) => {
    const dep = (i.depto || "").trim();
    if (dep && dep !== "Sin Departamento") {
      if (!map[dep]) map[dep] = { nombre: dep, foliosCount: 0, ingresosCount: 0 };
      map[dep].ingresosCount++;
    }
  });
  (carteraData.value?.por_depto || []).forEach((p) => {
    const dep = (p.depto || "").trim();
    if (dep && dep !== "Sin Departamento") {
      if (!map[dep]) map[dep] = { nombre: dep, foliosCount: p.total_documentos || 0, ingresosCount: 0 };
    }
  });
  return Object.values(map).sort((a, b) => a.nombre.localeCompare(b.nombre));
});

const deptoSelectOptions = computed(() => {
  return [
    {
      label: `Todos los Departamentos (${carteraData.value?.totales?.total_documentos || 0} folios)`,
      value: "TODOS",
    },
    ...availableDeptos.value.map((d) => ({
      label: `${d.nombre} (${d.foliosCount} folio${d.foliosCount === 1 ? "" : "s"})`,
      value: d.nombre,
    })),
  ];
});

const toggleDepto = (dep) => {
  if (selectedDepto.value === dep) {
    selectedDepto.value = "TODOS";
  } else {
    selectedDepto.value = dep;
  }
};

// Folios detallados filtrados por departamento
const filteredDetalles = computed(() => {
  const all = carteraData.value?.detalles || [];
  if (!selectedDepto.value || selectedDepto.value === "TODOS") return all;
  return all.filter(
    (d) => (d.depto || "").trim().toLowerCase() === selectedDepto.value.trim().toLowerCase()
  );
});

// Totales de carátula recalculados según el departamento seleccionado
const filteredTotales = computed(() => {
  if (!selectedDepto.value || selectedDepto.value === "TODOS") {
    return carteraData.value?.totales || null;
  }
  const items = filteredDetalles.value;
  const m90 = items.reduce((acc, r) => acc + (Number(r.mas_de_90) || 0), 0);
  const m60 = items.reduce((acc, r) => acc + (Number(r.mas_de_60) || 0), 0);
  const m30 = items.reduce((acc, r) => acc + (Number(r.mas_de_30) || 0), 0);
  const m15 = items.reduce((acc, r) => acc + (Number(r.mas_de_15) || 0), 0);
  const m1a15 = items.reduce((acc, r) => acc + (Number(r.de_1_a_15) || 0), 0);
  const pVencer = items.reduce((acc, r) => acc + (Number(r.por_vencer) || 0), 0);
  const cTotal = items.reduce((acc, r) => acc + (Number(r.cartera_total) || 0), 0);
  const vencido = m90 + m60 + m30 + m15 + m1a15;

  return {
    cliente: carteraData.value?.totales?.cliente,
    mas_de_90: m90,
    mas_de_60: m60,
    mas_de_30: m30,
    mas_de_15: m15,
    de_1_a_15: m1a15,
    por_vencer: pVencer,
    total_vencido: vencido,
    cartera_total: cTotal > 0 ? cTotal : vencido + pVencer,
    total_documentos: items.length,
    total_folios: items.length,
  };
});

const filteredPctVencido = computed(() => {
  const total = Number(filteredTotales.value?.cartera_total) || 0;
  const vencido = Number(filteredTotales.value?.total_vencido) || 0;
  if (total <= 0) return 0;
  return ((vencido / total) * 100).toFixed(1);
});

const formatMoneyInt = (val) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(val || 0));
};

const formatCellMoney = (val) => {
  const num = Number(val);
  if (!num || num === 0) return "";
  return formatMoneyInt(num);
};

// Colores elegantes y contrastados para gráficas de pastel
const chartColors = [
  "#3b82f6", // azul
  "#10b981", // verde esmeralda
  "#f59e0b", // ámbar
  "#ec4899", // rosa
  "#8b5cf6", // violeta
  "#06b6d4", // cian
  "#f97316", // naranja
  "#6366f1", // índigo
  "#14b8a6", // teal
  "#e11d48", // rojo carmesí
];

// --- GRÁFICA: DEUDA POR SUCURSAL (DINÁMICA POR DEPARTAMENTO) ---
const sucursalData = computed(() => {
  const items = filteredDetalles.value;
  const map = {};
  items.forEach((d) => {
    const k = d.sucursal || "Sin Sucursal";
    map[k] = (map[k] || 0) + (Number(d.cartera_total) || 0);
  });
  return Object.keys(map).map((k) => ({ sucursal: k, total: map[k] }));
});

const sucursalSeries = computed(() => {
  return sucursalData.value.map((s) => Number(s.total) || 0);
});

const sucursalLabels = computed(() => {
  return sucursalData.value.map((s) => s.sucursal);
});

const sucursalTotalSum = computed(() => {
  return sucursalSeries.value.reduce((acc, val) => acc + val, 0);
});

const sucursalChartOptions = computed(() => ({
  chart: {
    type: "pie",
    background: "transparent",
    foreColor: "#cbd5e1",
    toolbar: { show: false },
  },
  labels: sucursalLabels.value,
  colors: chartColors,
  stroke: {
    colors: ["#111827"],
    width: 2,
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => val.toFixed(1) + "%",
    style: {
      fontSize: "11px",
      fontWeight: 700,
      colors: ["#ffffff"],
    },
    dropShadow: { enabled: false },
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontSize: "12px",
    labels: { colors: "#cbd5e1" },
    markers: { radius: 12 },
    itemMargin: { horizontal: 8, vertical: 4 },
  },
  tooltip: {
    theme: "dark",
    y: {
      formatter: (val) => formatMoneyInt(val),
    },
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: { width: "100%" },
        legend: { position: "bottom" },
      },
    },
  ],
}));

// --- GRÁFICA: DEUDA POR DEPARTAMENTO (GLOBAL) ---
const deptoData = computed(() => {
  if (carteraData.value?.por_depto?.length) {
    return carteraData.value.por_depto;
  }
  const map = {};
  (carteraData.value?.detalles || []).forEach((d) => {
    const k = d.depto || "Sin Departamento";
    map[k] = (map[k] || 0) + (Number(d.cartera_total) || 0);
  });
  return Object.keys(map).map((k) => ({ depto: k, total: map[k] }));
});

const deptoSeries = computed(() => {
  return deptoData.value.map((d) => Number(d.total) || 0);
});

const deptoLabels = computed(() => {
  return deptoData.value.map((d) => d.depto);
});

const deptoTotalSum = computed(() => {
  return deptoSeries.value.reduce((acc, val) => acc + val, 0);
});

const deptoChartOptions = computed(() => ({
  chart: {
    type: "pie",
    background: "transparent",
    foreColor: "#cbd5e1",
    toolbar: { show: false },
  },
  labels: deptoLabels.value,
  colors: [
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f97316",
    "#14b8a6",
    "#a855f7",
    "#64748b",
  ],
  stroke: {
    colors: ["#111827"],
    width: 2,
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => val.toFixed(1) + "%",
    style: {
      fontSize: "11px",
      fontWeight: 700,
      colors: ["#ffffff"],
    },
    dropShadow: { enabled: false },
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontSize: "12px",
    labels: { colors: "#cbd5e1" },
    markers: { radius: 12 },
    itemMargin: { horizontal: 8, vertical: 4 },
  },
  tooltip: {
    theme: "dark",
    y: {
      formatter: (val) => formatMoneyInt(val),
    },
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: { width: "100%" },
        legend: { position: "bottom" },
      },
    },
  ],
}));

// Helpers para normalización de folios
const normalizeFolio = (f) => String(f || "").trim().toUpperCase();
const cleanFolio = (f) => String(f || "").trim().toUpperCase().replace(/[\s\-_]/g, "");

// Set de folios existentes en la cartera vencida del cliente (según el departamento seleccionado)
const activeCarteraFoliosSet = computed(() => {
  const set = new Set();
  const detalles = filteredDetalles.value || [];
  detalles.forEach((d) => {
    const fKey = normalizeFolio(d.folio);
    const fClean = cleanFolio(d.folio);
    if (fKey && fKey !== "SIN_FOLIO") set.add(fKey);
    if (fClean && fClean !== "SIN_FOLIO") set.add(fClean);
  });
  return set;
});

// --- SEGUNDA FUENTE: INGRESOS FILTRADOS (SOLO FOLIOS EN CARTERA VENCIDA) ---
const filteredIngresosItems = computed(() => {
  const all = carteraData.value?.ingresos?.items || [];
  const validFolios = activeCarteraFoliosSet.value;

  return all.filter((i) => {
    // REGLA: Si el folio está en INGRESOS pero NO está en cartera vencida, NO DEBE APARECER
    const fKey = normalizeFolio(i.folio);
    const fClean = cleanFolio(i.folio);
    const existeEnCartera = (fKey && validFolios.has(fKey)) || (fClean && validFolios.has(fClean));
    if (!existeEnCartera) return false;

    if (selectedDepto.value && selectedDepto.value !== "TODOS") {
      return (i.depto || "").trim().toLowerCase() === selectedDepto.value.trim().toLowerCase();
    }
    return true;
  });
});

const filteredIngresosTotales = computed(() => {
  const items = filteredIngresosItems.value;
  return {
    credito: items.reduce((acc, r) => acc + (Number(r.credito) || 0), 0),
    contado: items.reduce((acc, r) => acc + (Number(r.contado) || 0), 0),
    nota_debito: items.reduce((acc, r) => acc + (Number(r.nota_debito) || 0), 0),
    nota_credito: items.reduce((acc, r) => acc + (Number(r.nota_credito) || 0), 0),
    pagos_cobranza: items.reduce((acc, r) => acc + (Number(r.pagos_cobranza) || 0), 0),
    pagos_mostrador: items.reduce((acc, r) => acc + (Number(r.pagos_mostrador) || 0), 0),
    total_filas: items.length,
  };
});

// Mapa cronológico de meses
const MESES_MAP = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
};

const NOMBRES_MESES = [
  "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// Helper para extraer { ano, mes } de la columna FECHA VEN (Columna Y)
const parseFechaVencimiento = (str) => {
  if (!str) return null;
  const s = String(str).trim().split(" ")[0];
  if (!s) return null;

  if (s.includes("/")) {
    const parts = s.split("/");
    if (parts.length >= 3) {
      if (parts[0].length === 4) {
        let ano = parseInt(parts[0], 10);
        let mes = parseInt(parts[1], 10);
        if (ano < 100) ano += 2000;
        return { ano, mes };
      }
      let ano = parseInt(parts[2], 10);
      let mes = parseInt(parts[1], 10);
      if (ano < 100) ano += 2000;
      return { ano, mes };
    }
  }

  if (s.includes("-")) {
    const parts = s.split("-");
    if (parts.length >= 3) {
      if (parts[0].length === 4) {
        let ano = parseInt(parts[0], 10);
        let mes = parseInt(parts[1], 10);
        if (ano < 100) ano += 2000;
        return { ano, mes };
      }
      let ano = parseInt(parts[2], 10);
      let mes = parseInt(parts[1], 10);
      if (ano < 100) ano += 2000;
      return { ano, mes };
    }
  }

  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return { ano: d.getFullYear(), mes: d.getMonth() + 1 };
  }

  return null;
};

// --- ANÁLISIS DE CRÉDITO Y PAGOS (RECALCULADO PARA EL DEPARTAMENTO) ---
const periodoFiltro = ref("mes"); // 'mes' o 'ano'

const filteredAnalisisCreditoPagos = computed(() => {
  // 1. Mapeo de abonos registrados en la tabla de Ingresos (Columna PAGOS COBRANZA)
  // Indexamos por folio normalizado (sin espacios y en mayúsculas)
  const abonosPorFolio = {};
  (filteredIngresosItems.value || []).forEach((ing) => {
    const fKey = normalizeFolio(ing.folio);
    const fClean = cleanFolio(ing.folio);
    if (!fKey || fKey === "SIN_FOLIO") return;
    const pagoCobranza = Number(ing.pagos_cobranza) || 0;
    if (pagoCobranza > 0) {
      abonosPorFolio[fKey] = (abonosPorFolio[fKey] || 0) + pagoCobranza;
      if (fClean && fClean !== fKey) {
        abonosPorFolio[fClean] = (abonosPorFolio[fClean] || 0) + pagoCobranza;
      }
    }
  });

  // 2. Universo de la comparativa: ÚNICAMENTE folios presentes en Cartera Vencida (Carátula)
  // Lo que debe es la columna de total (cartera_total o total).
  // Lo que esté en ingresos y NO esté en cartera vencida NO debe aparecer en la comparativa.
  const caratulaItems = (filteredDetalles.value || []).filter(
    (r) => (Number(r.cartera_total) || Number(r.total) || 0) > 0
  );

  // Consolidar folios de Cartera Vencida (por si existieran filas duplicadas o partidas del mismo folio)
  const foliosConsolidados = {};
  caratulaItems.forEach((r) => {
    const folioStr = String(r.folio || "SIN_FOLIO").trim();
    const fKey = normalizeFolio(folioStr);
    const fClean = cleanFolio(folioStr);
    const deuda = Number(r.cartera_total) || Number(r.total) || 0;

    if (!foliosConsolidados[fKey]) {
      // Si ese MISMO FOLIO se encuentra en la tabla de ingresos, tomamos lo abonado de PAGOS COBRANZA
      const abono = abonosPorFolio[fKey] || abonosPorFolio[fClean] || 0;
      foliosConsolidados[fKey] = {
        folio: folioStr,
        sucursal: r.sucursal || "",
        depto: r.depto || "",
        fecha_vencimiento: r.fecha_vencimiento || "",
        deuda: 0,
        abonos: abono,
      };
    }
    foliosConsolidados[fKey].deuda += deuda;
    if (r.sucursal) foliosConsolidados[fKey].sucursal = r.sucursal;
    if (r.depto) foliosConsolidados[fKey].depto = r.depto;
    if (r.fecha_vencimiento) foliosConsolidados[fKey].fecha_vencimiento = r.fecha_vencimiento;
  });

  const foliosUnicos = Object.values(foliosConsolidados);

  // Totales globales exclusivos de los folios de cartera vencida
  const deudaTotalCartera = foliosUnicos.reduce((acc, f) => acc + f.deuda, 0);
  const pagosTotalAbonado = foliosUnicos.reduce((acc, f) => acc + f.abonos, 0);
  const saldoPendienteReal = deudaTotalCartera - pagosTotalAbonado;

  const pctPagado = deudaTotalCartera > 0 ? ((pagosTotalAbonado / deudaTotalCartera) * 100).toFixed(1) : 0;
  const pctPendiente = deudaTotalCartera > 0 ? ((saldoPendienteReal / deudaTotalCartera) * 100).toFixed(1) : 0;

  // 3. Agrupación por Mes y por Año según la Fecha de Vencimiento de cada folio de Cartera Vencida
  const mapMes = {};
  const mapAno = {};

  foliosUnicos.forEach((f) => {
    const parsed = parseFechaVencimiento(f.fecha_vencimiento);
    const fDeuda = Math.round(f.deuda);
    const fAbonos = Math.round(f.abonos);
    const fSaldo = fDeuda - fAbonos;
    const fPct = fDeuda > 0 ? ((fAbonos / fDeuda) * 100).toFixed(1) : (fAbonos > 0 ? "100.0" : "0.0");

    const folioItem = {
      folio: f.folio,
      sucursal: f.sucursal,
      depto: f.depto,
      fecha: f.fecha_vencimiento || "Sin Fecha",
      deuda: fDeuda,
      abonos: fAbonos,
      saldo: fSaldo,
      pct: fPct,
    };

    // --- Agrupación por Mes ---
    let mesKey, mesLabel, mNum, anoNum;
    if (parsed && parsed.ano && parsed.mes) {
      anoNum = parsed.ano;
      mNum = parsed.mes;
      mesKey = `${anoNum}-${String(mNum).padStart(2, "0")}`;
      mesLabel = `${NOMBRES_MESES[mNum] || ('Mes ' + mNum)} ${anoNum}`;
    } else {
      anoNum = 9999;
      mNum = 0;
      mesKey = "SIN_FECHA";
      mesLabel = "Sin Fecha";
    }

    if (!mapMes[mesKey]) {
      mapMes[mesKey] = {
        periodo: mesKey,
        label: mesLabel,
        mes: mNum,
        ano: anoNum,
        vencido: 0,
        pagos: 0,
        folios: [],
      };
    }
    mapMes[mesKey].vencido += fDeuda;
    mapMes[mesKey].pagos += fAbonos;
    mapMes[mesKey].folios.push(folioItem);

    // --- Agrupación por Año ---
    let anoKey, anoLabel;
    if (parsed && parsed.ano) {
      anoKey = String(parsed.ano);
      anoLabel = `Año ${parsed.ano}`;
    } else {
      anoKey = "Sin Año";
      anoLabel = "Sin Año";
    }

    if (!mapAno[anoKey]) {
      mapAno[anoKey] = {
        ano: anoKey,
        label: anoLabel,
        vencido: 0,
        pagos: 0,
        folios: [],
      };
    }
    mapAno[anoKey].vencido += fDeuda;
    mapAno[anoKey].pagos += fAbonos;
    mapAno[anoKey].folios.push(folioItem);
  });

  const porMes = Object.values(mapMes).map((m) => {
    m.folios.sort((a, b) => (b.deuda - a.deuda) || (b.abonos - a.abonos));
    return m;
  }).sort((a, b) => a.periodo.localeCompare(b.periodo));

  const porAno = Object.values(mapAno).map((a) => {
    a.folios.sort((a, b) => (b.deuda - a.deuda) || (b.abonos - a.abonos));
    return a;
  }).sort((a, b) => a.ano.localeCompare(b.ano));

  return {
    credito_total_otorgado: deudaTotalCartera,
    credito_total: deudaTotalCartera,
    cartera_deuda_total: deudaTotalCartera,
    pagos_total: pagosTotalAbonado,
    cartera_pendiente: saldoPendienteReal,
    saldo_pendiente_real: saldoPendienteReal,
    porcentaje_pagado: pctPagado,
    porcentaje_pendiente: pctPendiente,
    por_ano: porAno,
    por_mes: porMes,
    total_folios_cartera: foliosUnicos.length,
  };
});

// Gráfica 1: Balance General de Crédito y Pagos
const generalChartSeries = computed(() => {
  const a = filteredAnalisisCreditoPagos.value;
  if (!a) return [];
  return [
    {
      name: "Monto",
      data: [
        Number(a.credito_total_otorgado || a.credito_total) || 0,
        Number(a.pagos_total) || 0,
        Number(a.cartera_pendiente) || 0,
      ],
    },
  ];
});

const generalChartOptions = computed(() => {
  const a = filteredAnalisisCreditoPagos.value;
  const pctPagado = a?.porcentaje_pagado || 0;
  const pctPendiente = a?.porcentaje_pendiente || 0;
  return {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
      foreColor: "#cbd5e1",
    },
    theme: { mode: "dark" },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: "55%",
        distributed: true,
      },
    },
    colors: ["#f59e0b", "#10b981", "#ef4444"],
    legend: { show: false },
    xaxis: {
      categories: [
        "Deuda Cartera Vencida",
        `Abonado a estos Folios (${pctPagado}%)`,
        `Saldo Pendiente Real (${pctPendiente}%)`,
      ],
      labels: {
        style: { colors: "#94a3b8" },
        formatter: (v) => formatMoneyInt(v),
      },
      axisBorder: { color: "#374151" },
    },
    yaxis: {
      labels: {
        style: { colors: "#e2e8f0", fontSize: "11px", fontWeight: 600 },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (v) => formatMoneyInt(v),
      style: { colors: ["#ffffff"], fontSize: "11px", fontWeight: 700 },
      dropShadow: { enabled: false },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (v) => formatMoneyInt(v),
      },
    },
  };
});

// --- COMPARATIVA: LO QUE SE DEBE VS LO ABONADO (POR CLIENTE) ---
const filtroClienteAno = ref("todos");
const expandedPeriodos = ref({});

const togglePeriodo = (periodoKey) => {
  expandedPeriodos.value[periodoKey] = !expandedPeriodos.value[periodoKey];
};

const availableClienteAnos = computed(() => {
  const a = filteredAnalisisCreditoPagos.value;
  if (!a) return [];
  const set = new Set();
  (a.por_mes || []).forEach((m) => {
    if (m.ano && m.ano !== 9999) set.add(String(m.ano));
  });
  return Array.from(set).sort();
});

// Lista de items del cliente desglosados (por mes o por año, con filtro de año si aplica)
const clientComparativaItems = computed(() => {
  const a = filteredAnalisisCreditoPagos.value;
  if (!a) return [];
  let list = periodoFiltro.value === "ano" ? (a.por_ano || []) : (a.por_mes || []);

  if (periodoFiltro.value === "mes" && filtroClienteAno.value !== "todos") {
    list = list.filter((item) => String(item.ano) === String(filtroClienteAno.value));
  }

  return list.map((item) => {
    const deuda = Math.round(Number(item.vencido) || 0);
    const abonos = Math.round(Number(item.pagos) || 0);
    const saldo = deuda - abonos;
    const pct = deuda > 0 ? ((abonos / deuda) * 100).toFixed(1) : (abonos > 0 ? "100.0" : "0.0");
    return {
      periodo: item.periodo || item.ano,
      label: item.label || `Año ${item.ano}`,
      deuda,
      abonos,
      saldo,
      pct,
      folios: item.folios || [],
    };
  });
});

// Resumen de deuda y abonos del cliente para el periodo activo
const totalDebePeriodo = computed(() => {
  return clientComparativaItems.value.reduce((acc, r) => acc + (Number(r.deuda) || 0), 0);
});

const totalAbonadoPeriodo = computed(() => {
  return clientComparativaItems.value.reduce((acc, r) => acc + (Number(r.abonos) || 0), 0);
});

const pctCobradoPeriodo = computed(() => {
  if (totalDebePeriodo.value <= 0) return totalAbonadoPeriodo.value > 0 ? "100.0" : "0.0";
  return ((totalAbonadoPeriodo.value / totalDebePeriodo.value) * 100).toFixed(1);
});

// Series y categorías para la gráfica de barras del cliente
const evolucionSeries = computed(() => {
  const list = clientComparativaItems.value;
  if (!list.length) return [];
  return [
    {
      name: "Lo que se debe",
      data: list.map((item) => item.deuda),
    },
    {
      name: "Lo que se ha abonado a estos folios",
      data: list.map((item) => item.abonos),
    },
  ];
});

const evolucionCategories = computed(() => {
  return clientComparativaItems.value.map((item) => item.label);
});

const evolucionChartOptions = computed(() => ({
  chart: {
    type: "bar",
    toolbar: { show: false },
    background: "transparent",
    foreColor: "#cbd5e1",
  },
  theme: { mode: "dark" },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (v) => (v > 0 ? formatMoneyInt(v) : ""),
    style: { colors: ["#ffffff"], fontSize: "10px", fontWeight: 700 },
    dropShadow: { enabled: false },
  },
  stroke: { show: false },
  colors: ["#fbbf24", "#10b981"],
  xaxis: {
    categories: evolucionCategories.value,
    labels: {
      style: { colors: "#94a3b8", fontSize: "11px" },
      rotate: periodoFiltro.value === "mes" ? -35 : 0,
    },
    axisBorder: { color: "#374151" },
  },
  yaxis: {
    labels: {
      style: { colors: "#94a3b8" },
      formatter: (v) => formatMoneyInt(v),
    },
  },
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "left",
    labels: { colors: "#cbd5e1" },
    markers: { radius: 12 },
    itemMargin: { horizontal: 10, vertical: 4 },
  },
  tooltip: {
    theme: "dark",
    y: {
      formatter: (v) => formatMoneyInt(v),
    },
  },
}));

const detalleColumns = [
  { name: "folio", label: "Folio", field: "folio", align: "left", sortable: true },
  { name: "sucursal", label: "Sucursal", field: "sucursal", align: "left", sortable: true },
  { name: "depto", label: "Departamento", field: "depto", align: "left", sortable: true },
  { name: "fecha_vencimiento", label: "Vencimiento", field: "fecha_vencimiento", align: "center", sortable: true },
  { name: "mas_de_90", label: "+90 Días", field: (r) => formatMoneyInt(r.mas_de_90), align: "right", sortable: true },
  { name: "mas_de_60", label: "+60 Días", field: (r) => formatMoneyInt(r.mas_de_60), align: "right", sortable: true },
  { name: "mas_de_30", label: "+30 Días", field: (r) => formatMoneyInt(r.mas_de_30), align: "right", sortable: true },
  { name: "mas_de_15", label: "+15 Días", field: (r) => formatMoneyInt(r.mas_de_15), align: "right", sortable: true },
  { name: "de_1_a_15", label: "1-15 Días", field: (r) => formatMoneyInt(r.de_1_a_15), align: "right", sortable: true },
  { name: "por_vencer", label: "Por Vencer", field: (r) => formatMoneyInt(r.por_vencer), align: "right", sortable: true },
  { name: "total_vencido", label: "Total Vencido", field: "total_vencido", align: "right", sortable: true },
  { name: "cartera_total", label: "Cartera Total", field: "cartera_total", align: "right", sortable: true },
];

const loadCarteraData = async () => {
  const nombre = currentClienteNombre.value;
  const clienteId = props.cliente?.id;

  if (!nombre && !clienteId && !props.cliente?.equip) return;

  loading.value = true;
  try {
    const res = await api.get("/api/intranet/cartera-vencida/cliente", {
      params: {
        cliente_id: clienteId,
        nombre: nombre,
        equip: props.cliente?.equip,
      },
    });
    carteraData.value = res.data;
  } catch (error) {
    console.error("Error al cargar cartera vencida:", error);
    Notify.create({
      type: "negative",
      message: "Error al obtener la cartera vencida.",
      position: "top",
    });
  } finally {
    loading.value = false;
  }
};

const syncGoogleSheet = async () => {
  syncing.value = true;
  try {
    const res = await api.post("/api/intranet/cartera-vencida/sync");
    Notify.create({
      type: res.data?.success ? "positive" : "negative",
      message: res.data?.message || "Sincronización completada.",
      position: "top",
    });
    await loadCarteraData();
  } catch (error) {
    console.error("Error al sincronizar cartera vencida:", error);
    Notify.create({
      type: "negative",
      message: "Error al contactar con el servidor.",
      position: "top",
    });
  } finally {
    syncing.value = false;
  }
};

onMounted(() => {
  loadCarteraData();
});

watch(
  () => props.cliente,
  (newVal) => {
    selectedDepto.value = "TODOS";
    if (newVal) loadCarteraData();
  },
  { deep: true }
);
</script>

<style scoped>
.cartera-vencida-container {
  background-color: #0b111e;
  min-height: 500px;
  border-radius: 8px;
  overflow: visible !important;
}

.cartera-content {
  overflow: visible !important;
}

.filter-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #0d1526 !important;
  border: 1px solid #2e4465;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
}

.row-hover-depto {
  transition: background-color 0.15s ease;
}

.row-hover-depto:hover td {
  background-color: #18263c !important;
}

.row-active-depto td {
  background-color: #1d2e48 !important;
  color: #fef08a !important;
}

.row-active-depto td.td-cliente {
  background-color: #192a44 !important;
  color: #fbbf24 !important;
  border-left: 3px solid #f59e0b;
}

.bg-dark-card {
  background-color: #131b29;
  border: 1px solid #28374d;
}

.kpi-box {
  background: linear-gradient(135deg, #131b29 0%, #1a2436 100%);
  border: 1px solid #28374d;
  border-radius: 6px;
  padding: 12px 8px;
  height: 100%;
}

/* TABLA CARTERA VENCIDA ETBSA IDÉNTICA A LA IMAGEN */
.cartera-table-card {
  background-color: #111827;
  border: 1px solid #374151;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
}

.cartera-banner-header {
  background: #c62828;
  color: #ffffff;
  font-size: 14px;
  letter-spacing: 0.8px;
  padding: 8px 12px;
  border-bottom: 2px solid #8e0000;
}

.cartera-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.cartera-etbsa-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  color: #f3f4f6;
  white-space: nowrap;
}

.cartera-etbsa-table th {
  background-color: #182234;
  color: #ffffff;
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 0.5px;
  padding: 10px 12px;
  border-right: 1px solid #2a3a52;
  border-bottom: 1px solid #3b82f6;
}

.cartera-etbsa-table th:last-child {
  border-right: none;
}

.cartera-etbsa-table th.th-cliente {
  min-width: 180px;
}

.cartera-etbsa-table th.th-highlight {
  background-color: #1e293b;
  color: #fca5a5;
}

.cartera-etbsa-table th.th-total {
  background-color: #1e293b;
  color: #fef08a;
}

.cartera-etbsa-table td {
  padding: 10px 12px;
  background-color: #0f172a;
  border-right: 1px solid #1e293b;
  border-bottom: 1px solid #1e293b;
  font-variant-numeric: tabular-nums;
}

.cartera-etbsa-table td:last-child {
  border-right: none;
}

.cartera-etbsa-table td.td-cliente {
  color: #ffffff;
  background-color: #0d1525;
}

.cartera-etbsa-table td.td-vencido {
  color: #fca5a5;
}

.cartera-etbsa-table td.td-cartera-total {
  color: #fef08a;
}

/* FILA DE TOTAL (ROJO SÓLIDO COMO EN LA IMAGEN) */
.cartera-total-row td {
  background-color: #8b151e !important;
  color: #ffffff !important;
  font-weight: 800;
  border-right: 1px solid #a31c26;
  border-top: 2px solid #b91c1c;
  padding: 10px 12px;
}

.cartera-total-row td:last-child {
  border-right: none;
}

/* TABLA DE DESGLOSE CON SCROLLBAR Y HEADER FIJO */
.detalle-table-scroll {
  max-height: 480px;
}

.cartera-table-wrap.detalle-table-scroll {
  max-height: 480px;
  overflow-y: auto;
  overflow-x: auto;
}

.cartera-table-wrap.detalle-table-scroll thead th {
  position: sticky;
  top: 0;
  z-index: 3;
  background-color: #182234;
}

.cartera-table-wrap.detalle-table-scroll tfoot td {
  position: sticky;
  bottom: 0;
  z-index: 3;
}

.cartera-table-wrap.detalle-table-scroll::-webkit-scrollbar,
.detalle-table-scroll :deep(.q-table__middle)::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.cartera-table-wrap.detalle-table-scroll::-webkit-scrollbar-track,
.detalle-table-scroll :deep(.q-table__middle)::-webkit-scrollbar-track {
  background: #0b111e;
}

.cartera-table-wrap.detalle-table-scroll::-webkit-scrollbar-thumb,
.detalle-table-scroll :deep(.q-table__middle)::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}

.cartera-table-wrap.detalle-table-scroll::-webkit-scrollbar-thumb:hover,
.detalle-table-scroll :deep(.q-table__middle)::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}

/* FILAS Y CELDAS RESALTADAS DE ROJO PARA +90 DÍAS */
.row-vencido-90 {
  background-color: rgba(185, 28, 28, 0.16) !important;
}

.row-vencido-90:hover {
  background-color: rgba(185, 28, 28, 0.28) !important;
}

.row-vencido-90 td {
  border-bottom: 1px solid rgba(239, 68, 68, 0.3) !important;
}

.td-mas90-cell {
  background-color: rgba(220, 38, 38, 0.22) !important;
  color: #ff6b6b !important;
}

/* CAJAS PARA GRÁFICAS DE PASTEL */
.chart-box {
  background: linear-gradient(135deg, #111827 0%, #172235 100%);
  border: 1px solid #28374d;
  border-radius: 6px;
  overflow: hidden;
  height: 100%;
}

.chart-header-row {
  background-color: #0f172a;
  border-bottom: 1px solid #1e293b;
}

.kpi-mini-box {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid #28374d;
  border-radius: 6px;
  padding: 8px 6px;
}

/* DESGLOSE DESPLEGABLE DE FOLIOS POR PERIODO */
.row-periodo-parent {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.row-periodo-parent:hover td {
  background-color: #1e293b !important;
}

.row-periodo-active td {
  background-color: #162032 !important;
  border-bottom: 1px solid #d97706 !important;
}

.row-periodo-desglose td {
  padding: 0 !important;
  background-color: #080d17 !important;
  border-bottom: 2px solid #d97706 !important;
}

.desglose-folios-container {
  background-color: #080d17;
  padding: 8px 12px 14px 12px;
  border-left: 4px solid #f59e0b;
}

.desglose-folios-header {
  background-color: #101927;
  border: 1px solid #24344d;
  border-bottom: none;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.subtable-scroll-wrap {
  max-height: 320px;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #24344d;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.subtable-scroll-wrap::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.subtable-scroll-wrap::-webkit-scrollbar-track {
  background: #080d17;
}

.subtable-scroll-wrap::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 3px;
}

.subtable-scroll-wrap::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}

.subtable-folios {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  color: #e2e8f0;
  white-space: nowrap;
}

.subtable-folios thead th {
  position: sticky;
  top: 0;
  background-color: #18253a;
  color: #cbd5e1;
  font-size: 11px;
  font-weight: 700;
  padding: 7px 10px;
  border-bottom: 1px solid #2e415e;
  border-right: 1px solid #1e2d42;
  z-index: 2;
}

.subtable-folios thead th:last-child {
  border-right: none;
}

.subtable-folios tbody tr td {
  padding: 6px 10px;
  background-color: #0c1322;
  border-bottom: 1px solid #162033;
  border-right: 1px solid #162033;
  font-size: 11.5px;
}

.subtable-folios tbody tr:last-child td {
  border-bottom: none;
}

.subtable-folios tbody tr td:last-child {
  border-right: none;
}

.subtable-folios tbody tr:hover td {
  background-color: #172439 !important;
}
</style>
