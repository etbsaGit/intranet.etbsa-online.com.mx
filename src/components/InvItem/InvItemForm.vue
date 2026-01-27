<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab name="general" label="General" />
    <q-tab name="configirations" label="Configuraciones" />
    <q-tab name="docs" label="Documentos" />
  </q-tabs>

  <q-separator />

  <q-form ref="myForm" greedy class="form-container">
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="general">
        <q-item>
          <q-item-section>
            <q-input
              v-model="formItem.rd"
              outlined
              dense
              label="RD"
              lazy-rules
              class="form-input"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formItem.shipping_date"
              outlined
              dense
              readonly
              label="Fecha de RD"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date minimal v-model="formItem.shipping_date">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formItem.inv_factory_id"
              :options="invFactories"
              label="Fabrica y/o proveedor"
              option-value="id"
              option-label="name"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              options-dense
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              v-model="formItem.inv_model_id"
              :options="invModels"
              label="Modelo"
              option-value="id"
              option-label="name"
              option-disable="inactive"
              emit-value
              map-options
              :disable="invItem != null"
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              options-dense
              :rules="[(val) => val !== null || 'Obligatorio']"
              @update:model-value="getForModel(formItem.inv_model_id)"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formItem.sucursal_id"
              :options="sucursales"
              label="Sucursal"
              option-value="id"
              option-label="nombre"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              options-dense
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formItem.invoice"
              outlined
              dense
              label="Factura"
              lazy-rules
              class="form-input"
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formItem.purchase_cost"
              prefix="$"
              outlined
              dense
              label="Costo"
              hint
              mask="###,###,###.##"
              reverse-fill-mask
              input-class="text-right"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formItem.invoice_date"
              outlined
              dense
              readonly
              label="Fecha de factura"
              hint
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date minimal v-model="formItem.invoice_date">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formItem.s_n"
              outlined
              dense
              label="# de serie"
              lazy-rules
              class="form-input"
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formItem.s_n_m"
              outlined
              dense
              label="# de serie del motor"
              lazy-rules
              class="form-input"
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formItem.e_n"
              outlined
              dense
              label="# economico"
              lazy-rules
              class="form-input"
              hint
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              v-model="formItem.shipping_status"
              :options="shippingStatuses"
              label="Estatus del envio"
              option-disable="inactive"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              hint
              options-dense
            />
          </q-item-section>

          <q-item-section>
            <q-select
              v-model="formItem.is_paid"
              :options="paidStatuses"
              label="Estatus del pago"
              option-value="id"
              option-label="name"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              hint
              options-dense
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formItem.gps"
              :options="gpsStatuses"
              label="Estatus del GPS"
              option-value="id"
              option-label="name"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              hint
              options-dense
            />
          </q-item-section>

          <q-item-section>
            <q-select
              v-model="formItem.financing"
              :options="financingStatuses"
              label="Financiamiento"
              option-value="id"
              option-label="name"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              hint
              options-dense
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formItem.notes"
              outlined
              dense
              label="Notas"
              type="textarea"
              lazy-rules
              class="form-input"
              hint
            />
          </q-item-section>
        </q-item>
      </q-tab-panel>

      <q-tab-panel name="configirations">
        <q-splitter
          v-model="splitterModel"
          class="splitter"
          style="height: 77vh"
        >
          <!-- ASIGNADAS -->
          <template #before>
            <div class="panel">
              <div class="panel-title">Configuraciones asignadas</div>

              <div
                v-if="configuracionesAsignadasPorCategoria.length === 0"
                class="text-grey-7"
              >
                No hay configuraciones asignadas.
              </div>

              <q-expansion-item
                v-for="grupo in configuracionesAsignadasPorCategoria"
                :key="'asig-' + grupo.id"
                expand-separator
                default-opened
                :label="grupo.name"
                header-class="expansion-header"
              >
                <q-list bordered separator>
                  <q-item
                    v-for="conf in grupo.items"
                    :key="'a-' + conf.id"
                    tag="label"
                  >
                    <q-item-section>
                      <q-item-label class="item-code">{{
                        conf.code
                      }}</q-item-label>
                      <q-item-label caption>{{ conf.name }}</q-item-label>
                    </q-item-section>

                    <q-item-section avatar>
                      <q-checkbox
                        v-model="selectedConfigurations"
                        :val="conf.id"
                        color="blue"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </div>
          </template>

          <!-- DISPONIBLES -->
          <template #after>
            <div class="panel">
              <div class="panel-title">Configuraciones disponibles</div>

              <!-- 🔎 Buscador -->
              <q-input
                v-model="searchDisponibles"
                dense
                outlined
                clearable
                debounce="250"
                placeholder="Buscar por código o nombre..."
                class="q-mb-sm"
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <div
                v-if="
                  configuracionesDisponiblesPorCategoriaFiltradas.length === 0
                "
                class="text-grey-7"
              >
                No hay configuraciones disponibles.
              </div>

              <q-expansion-item
                v-for="grupo in configuracionesDisponiblesPorCategoriaFiltradas"
                :key="'disp-' + grupo.id"
                expand-separator
                default-opened
                :label="grupo.name"
                header-class="expansion-header"
              >
                <q-list bordered separator>
                  <q-item
                    v-for="conf in grupo.items"
                    :key="'d-' + conf.id"
                    tag="label"
                  >
                    <q-item-section>
                      <q-item-label class="item-code">{{
                        conf.code
                      }}</q-item-label>
                      <q-item-label caption>{{ conf.name }}</q-item-label>
                    </q-item-section>

                    <q-item-section avatar>
                      <q-checkbox
                        v-model="selectedConfigurations"
                        :val="conf.id"
                        color="green"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </div>
          </template>
        </q-splitter>
      </q-tab-panel>

      <q-tab-panel name="docs">
        <q-item>
          <q-item-section>
            <q-file
              clearable
              color="secondary"
              dense
              outlined
              v-model="formItem.file"
              label="Subir documento"
              lazy-rules
              accept=".jpg, .jpeg, .png, .jfif, .pdf"
              multiple
              @clear="formItem.base64 = []"
              @input="convertirFile($event)"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section align="center">
            <q-item-label caption>- Archivos ya guardados -</q-item-label>
          </q-item-section>
        </q-item>
        <q-list v-if="invItem">
          <q-item v-for="(doc, index) in formItem.inv_item_docs" :key="index">
            <q-item-section avatar>
              <q-btn
                flat
                round
                dense
                icon="fa-solid fa-trash"
                color="red"
                @click="deleteDoc(doc.id)"
              />
            </q-item-section>
            <q-item-section avatar>
              <q-btn
                flat
                round
                dense
                icon="fa-solid fa-file-arrow-down"
                @click="openFile(doc.realpath)"
              />
            </q-item-section>
            <q-item-section>
              {{ doc.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </q-form>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { checkRole, sendRequest } from "src/boot/functions";

const { invItem } = defineProps(["invItem"]);

const myForm = ref(null);
const splitterModel = ref(50);
const tab = ref("general");

const invCategory = ref([]);
const invModels = ref([]);
const invFactories = ref([]);
const sucursales = ref([]);

const assignedConfigurations = ref([]); // objetos asignados (para pintar panel izq)
const selectedConfigurations = ref([]); // IDs seleccionados (truth)

const formItem = ref({
  id: invItem ? invItem.id : null,
  inv_factory_id: invItem ? invItem.inv_factory_id : null,
  rd: invItem ? invItem.rd : null,
  shipping_date: invItem ? invItem.shipping_date : null,
  shipping_status: invItem ? invItem.shipping_status : null,
  invoice: invItem ? invItem.invoice : null,
  s_n: invItem ? invItem.s_n : null,
  s_n_m: invItem ? invItem.s_n_m : null,
  e_n: invItem ? invItem.e_n : null,
  financing: invItem ? invItem.financing : null,
  invoice_date: invItem ? invItem.invoice_date : null,
  purchase_cost: invItem ? invItem.purchase_cost : null,
  is_paid: invItem ? invItem.is_paid : 0,
  gps: invItem ? invItem.gps : null,
  notes: invItem ? invItem.notes : null,
  inv_model_id: invItem ? invItem.inv_model_id : null,
  sucursal_id: invItem ? invItem.sucursal_id : null,
  inv_configurations: invItem
    ? invItem.inv_configurations.map((c) => c.id)
    : [],
  inv_item_docs: invItem ? invItem.inv_item_docs : [],

  base64: [],
  file: [],
});

const deleteDoc = async (id) => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/invItemDoc/" + id,
    ""
  );
  formItem.value.inv_item_docs = formItem.value.inv_item_docs.filter(
    (doc) => doc.id !== id
  );
};

const convertirFile = (event) => {
  const archivos = event.target.files;
  formItem.value.base64 = []; // limpiar antes de agregar nuevos

  if (archivos && archivos.length > 0) {
    Array.from(archivos).forEach((archivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        const objetoArchivo = {
          name: archivo.name,
          base64: base64Data,
        };
        formItem.value.base64.push(objetoArchivo);
      };
      reader.readAsDataURL(archivo);
    });
  }
};

const getOptions = async () => {
  const res = await sendRequest("GET", null, "/api/intranet/invItem/forms", "");
  invModels.value = res.invModels;
  invFactories.value = res.invFactories;
  sucursales.value = res.sucursales;
};

const getForModel = async (id) => {
  const res = await sendRequest(
    "GET",
    null,
    "/api/intranet/invItem/invModel/" + (id ?? ""),
    ""
  );
  invCategory.value = res.invCategory;
};

const allConfigsById = computed(() => {
  const map = new Map();
  (invCategory.value || []).forEach((cat) => {
    (cat.inv_configurations || []).forEach((cfg) => {
      map.set(cfg.id, {
        ...cfg,
        inv_category_id: cfg.inv_category_id ?? cat.id,
        inv_category: cfg.inv_category ?? { id: cat.id, name: cat.name },
      });
    });
  });
  return map;
});

// ✅ hidrata selección y asignadas (con fallback al invItem)
const hydrateFromInvItem = () => {
  const ids = invItem?.inv_configurations?.map((c) => c.id) || [];
  selectedConfigurations.value = [...ids];

  const fallbackObjects = invItem?.inv_configurations || [];

  assignedConfigurations.value = ids
    .map((id) => {
      // 1) intenta de lo cargado en invCategory
      const fromMap = allConfigsById.value.get(id);
      if (fromMap) return fromMap;

      // 2) fallback: lo que viene en invItem
      const fromItem = fallbackObjects.find((c) => c.id === id);
      if (!fromItem) return null;

      // asegúrate de traer categoría “decente”
      return {
        ...fromItem,
        inv_category_id: fromItem.inv_category_id ?? fromItem.inv_category?.id,
        inv_category:
          fromItem.inv_category ??
          (fromItem.inv_category_id
            ? { id: fromItem.inv_category_id, name: "Sin categoría" }
            : { id: null, name: "Sin categoría" }),
      };
    })
    .filter(Boolean);

  // sync al form
  formItem.value.inv_configurations = [...ids];
};

// ✅ init “real”: si existe invItem, carga options con su modelo y luego hidrata
const init = async () => {
  // const modelId = invItem?.inv_model_id ?? "";
  if (invItem) {
    getForModel(invItem.inv_model_id);
  }
  await getOptions();
  hydrateFromInvItem();
};

onMounted(async () => {
  await init();
});

// si cambias el modelo manualmente, recarga opciones (y NO destruyas selección)
// watch(
//   () => formItem.value.inv_model_id,
//   async (val, oldVal) => {
//     if (val === oldVal) return;
//     await getOptions(val);

//     // re-hidrata asignadas con lo nuevo que llegó en invCategory,
//     // pero conserva selectedConfigurations
//     assignedConfigurations.value = selectedConfigurations.value
//       .map((id) => allConfigsById.value.get(id))
//       .filter(Boolean);
//   }
// );

const configuracionesAsignadasPorCategoria = computed(() => {
  const grupos = {};

  assignedConfigurations.value.forEach((conf) => {
    if (!selectedConfigurations.value.includes(conf.id)) return;

    const categoryId = conf.inv_category_id ?? conf.inv_category?.id ?? null;
    const categoryName =
      (invCategory.value || []).find((c) => c.id === categoryId)?.name ??
      conf.inv_category?.name ??
      "Sin categoría";

    const key = categoryId ?? "sin-cat";

    if (!grupos[key]) {
      grupos[key] = { id: categoryId, name: categoryName, items: [] };
    }
    grupos[key].items.push(conf);
  });

  return Object.values(grupos);
});

const configuracionesDisponiblesPorCategoria = computed(() => {
  const res = [];

  (invCategory.value || []).forEach((cat) => {
    const items = (cat.inv_configurations || [])
      .filter((cfg) => !selectedConfigurations.value.includes(cfg.id))
      .map((cfg) => ({
        ...cfg,
        inv_category_id: cfg.inv_category_id ?? cat.id,
        inv_category: cfg.inv_category ?? { id: cat.id, name: cat.name },
      }));

    if (items.length > 0) {
      res.push({ id: cat.id, name: cat.name, items });
    }
  });

  return res;
});

watch(selectedConfigurations, (newVal, oldVal = []) => {
  const added = newVal.filter((id) => !oldVal.includes(id));
  added.forEach((id) => {
    const conf =
      allConfigsById.value.get(id) ||
      assignedConfigurations.value.find((c) => c.id === id);

    if (conf && !assignedConfigurations.value.some((c) => c.id === id)) {
      assignedConfigurations.value.push(conf);
    }
  });

  const removed = oldVal.filter((id) => !newVal.includes(id));
  assignedConfigurations.value = assignedConfigurations.value.filter(
    (c) => !removed.includes(c.id)
  );

  formItem.value.inv_configurations = newVal;
});

const searchDisponibles = ref("");

const normalizar = (s) =>
  (s ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita acentos

const configuracionesDisponiblesPorCategoriaFiltradas = computed(() => {
  const q = normalizar(searchDisponibles.value).trim();
  if (!q)
    return (
      configuracionesDisponiblesPorCategoria.value ??
      configuracionesDisponiblesPorCategoria
    );

  const source =
    configuracionesDisponiblesPorCategoria.value ??
    configuracionesDisponiblesPorCategoria;

  return (source || [])
    .map((grupo) => {
      const items = (grupo.items || []).filter((conf) => {
        const code = normalizar(conf.code);
        const name = normalizar(conf.name);
        return code.includes(q) || name.includes(q);
      });
      return { ...grupo, items };
    })
    .filter((grupo) => grupo.items.length > 0);
});

const validate = async () => {
  return await myForm.value.validate();
};

const openFile = (url) => {
  window.open(url, "_blank");
};

defineExpose({
  formItem,
  validate,
});

// statuses ...
const shippingStatuses = ref([
  { id: null, name: "En camino" },
  { id: 0, name: "En Inventario" },
  { id: 1, name: "Vendido" },
]);
const paidStatuses = ref([
  { id: 0, name: "Pendiente" },
  { id: 1, name: "Pagado" },
]);
const gpsStatuses = ref([
  { id: 0, name: "Pendiente" },
  { id: 1, name: "Instalado" },
]);
const financingStatuses = ref([{ id: 0, name: "Deposito" }]);
</script>

<style scoped>
/* Contenedor general */
.form-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

/* Filas del formulario */

/* Splitter */
.splitter {
  margin-top: 10px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

/* Paneles izquierdo y derecho */
.panel {
  padding: 16px;
  height: 100%;
  background-color: #fafafa;
}

/* Títulos de panel */
.panel-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #37474f;
}

/* Expansion headers */
.expansion-header {
  background-color: #f5f7fa;
  border-radius: 8px;
  font-weight: 500;
}

/* Código destacado */
.item-code {
  font-weight: 600;
  color: #1e88e5;
}
</style>
