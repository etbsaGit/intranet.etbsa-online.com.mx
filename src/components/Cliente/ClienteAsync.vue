<template>
  <div class="q-pa-md bg-grey-2 rounded-borders shadow-2">
    <!-- 🔍 Buscar empleados -->
    <q-card flat bordered class="q-pa-sm q-mb-md">
      <div class="row items-center q-col-gutter-sm">
        <div class="col">
          <q-input
            outlined
            dense
            label="Buscar empleado por nombre"
            v-model="filterFormE.search"
            clearable
            class="bg-white"
            @clear="resetFormulario"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="primary" />
            </template>
          </q-input>
        </div>
        <div>
          <q-btn
            label="Buscar"
            icon="search"
            dense
            color="primary"
            @click="getEmpleados"
          />
        </div>
      </div>
    </q-card>

    <!-- 👤 Selector de empleado -->
    <q-card flat bordered class="q-pa-sm q-mb-md">
      <q-select
        v-model="selectedEmpleado"
        :options="empleados"
        label="Seleccionar empleado"
        option-label="apellidoCompleto"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        outlined
        dense
        class="bg-white"
        @clear="resetFormulario"
      />
    </q-card>

    <!-- 🧭 Splitter -->
    <q-card flat bordered class="q-pa-sm">
      <q-splitter v-model="splitterModel" style="height: 520px">
        <!-- 📋 Asignados -->
        <template v-slot:before>
          <div class="q-pa-md bg-white rounded-borders shadow-1 full-height">
            <div class="text-h6 text-primary q-mb-sm flex items-center">
              <q-icon name="people" class="q-mr-sm" /> Asignados
            </div>
            <q-separator class="q-mb-sm" />

            <q-list bordered separator>
              <q-item
                v-for="cliente in selectedEmpleado?.clientes || []"
                :key="cliente.id"
                clickable
                tag="label"
              >
                <q-item-section avatar>
                  <q-checkbox
                    v-model="selectedCustomers"
                    :val="cliente.id"
                    color="green"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-bold">{{
                    cliente.nombre
                  }}</q-item-label>
                  <q-item-label caption class="text-grey-7">
                    {{ cliente.telefono || "Sin teléfono" }} —
                    {{ cliente.email || "Sin email" }} —
                    {{ cliente.rfc || "Sin RFC" }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </template>

        <!-- ➕ Por asignar -->
        <template v-slot:after>
          <div class="q-pa-md bg-white rounded-borders shadow-1 full-height">
            <div class="text-h6 text-primary q-mb-sm flex items-center">
              <q-icon name="person_add" class="q-mr-sm" /> Por asignar
            </div>
            <q-separator class="q-mb-sm" />
            <div class="row items-center q-col-gutter-sm q-mb-md">
              <div class="col">
                <q-input
                  outlined
                  dense
                  label="Buscar por nombre o RFC"
                  v-model="filterFormC.search"
                  clearable
                  class="bg-white"
                  @clear="resetFormulario"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" color="primary" />
                  </template>
                </q-input>
              </div>
              <div>
                <q-btn
                  label="Buscar"
                  icon="search"
                  dense
                  color="primary"
                  @click="getClientes"
                />
              </div>
            </div>

            <q-list bordered separator>
              <q-item
                v-for="cliente in clientesFiltrados"
                :key="cliente.id"
                clickable
                tag="label"
              >
                <q-item-section avatar>
                  <q-checkbox
                    v-model="selectedCustomers"
                    :val="cliente.id"
                    color="green"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-bold">{{
                    cliente.nombre
                  }}</q-item-label>
                  <q-item-label caption class="text-grey-7">
                    {{ cliente.telefono || "Sin teléfono" }} —
                    {{ cliente.email || "Sin email" }} —
                    {{ cliente.rfc || "Sin RFC" }}
                  </q-item-label>
                </q-item-section>
                <!-- 👇 Solo mostrar el icono si el cliente tiene empleados asignados -->
                <q-item-section
                  v-if="cliente.empleados && cliente.empleados.length > 0"
                  side
                >
                  <q-icon
                    name="fa-solid fa-user-group"
                    color="primary"
                    class="cursor-pointer"
                    size="18px"
                  >
                    <q-tooltip
                      class="bg-primary text-white text-body2"
                      anchor="center left"
                      self="center right"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <div class="text-bold text-center q-mb-xs">
                        Empleados asignados
                      </div>
                      <q-separator color="white" class="q-mb-xs opacity-30" />
                      <div
                        v-for="(empleado, index) in cliente.empleados"
                        :key="index"
                      >
                        • {{ empleado.nombreCompleto }}
                      </div>
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </template>
      </q-splitter>
    </q-card>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { sendRequest } from "src/boot/functions";

const splitterModel = ref(50);
const empleados = ref([]);
const clientes = ref([]);
const selectedCustomers = ref([]);
const selectedEmpleado = ref(null);

const filterFormE = ref({ search: null });
const filterFormC = ref({ search: null });

const getEmpleados = async () => {
  const res = await sendRequest(
    "POST",
    filterFormE.value,
    "/api/intranet/clientes/empleados",
    ""
  );
  empleados.value = res;
};

const getClientes = async () => {
  const res = await sendRequest(
    "POST",
    filterFormC.value,
    "/api/intranet/clientes/clientes",
    ""
  );
  clientes.value = res;
};

watch(selectedCustomers, (newValues, oldValues) => {
  if (!selectedEmpleado.value) return;

  const addedIds = newValues.filter((id) => !oldValues.includes(id));
  addedIds.forEach((id) => {
    const cliente = clientes.value.find((c) => c.id === id);
    if (
      cliente &&
      !selectedEmpleado.value.clientes.some((c) => c.id === cliente.id)
    ) {
      selectedEmpleado.value.clientes.push(cliente);
    }
  });

  const removedIds = oldValues.filter((id) => !newValues.includes(id));
  selectedEmpleado.value.clientes = selectedEmpleado.value.clientes.filter(
    (c) => !removedIds.includes(c.id)
  );
});

watch(selectedEmpleado, (nuevoEmpleado) => {
  if (nuevoEmpleado && nuevoEmpleado.clientes) {
    selectedCustomers.value = nuevoEmpleado.clientes.map((c) => c.id);
  } else {
    selectedCustomers.value = [];
  }
});

const clientesFiltrados = computed(() => {
  if (!selectedEmpleado.value) return clientes.value;
  const asignadosIds = selectedEmpleado.value.clientes.map((c) => c.id);
  return clientes.value.filter((c) => !asignadosIds.includes(c.id));
});

const resetFormulario = () => {
  // Limpiar filtros
  filterFormE.value.search = null;
  filterFormC.value.search = null;

  // Limpiar datos
  empleados.value = [];
  clientes.value = [];
  selectedCustomers.value = [];
  selectedEmpleado.value = null;

  // Opcional: si quieres reiniciar también el splitter
  splitterModel.value = 50;
};

defineExpose({ selectedEmpleado, selectedCustomers });
</script>

<style scoped>
.text-bold {
  font-weight: 600;
}
.rounded-borders {
  border-radius: 12px;
}
.q-card {
  transition: all 0.2s ease;
}
.q-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.full-height {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
