<template>
  <q-form ref="myForm" greedy>
    <!-- categoria -->
    <q-item>
      <q-item-section>
        <q-select
          v-model="formProducto.category_id"
          :options="categorias"
          label="Categoría"
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
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <!-- subcategoria -->
    <q-item>
      <q-item-section>
        <q-select
          v-model="formProducto.subcategory_id"
          :options="subcategoriasFiltradas"
          label="SubCategoría"
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
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>

    <!-- marca -->
    <q-item>
      <q-item-section>
        <q-select
          v-model="formProducto.brand_id"
          :options="marcas"
          label="Marca"
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
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>

    <!-- proveedor -->
    <q-item>
      <q-item-section>
        <q-select
          v-model="formProducto.vendor_id"
          :options="proveedores"
          label="Proveedores"
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
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>

    <!-- nombre -->
    <q-item>
      <q-item-section>
        <q-input
          v-model="formProducto.name"
          outlined
          dense
          label="Producto"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>

    <!-- descripcion -->
    <q-item>
      <q-item-section>
        <q-input
          type="textarea"
          v-model="formProducto.description"
          outlined
          dense
          label="Descripción"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <!-- SKU -->
    <q-item>
      <q-item-section>
        <q-input
          v-model="formProducto.sku"
          outlined
          dense
          label="SKU"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>

    <q-select
      v-model="formProducto.currency_id"
      :options="monedas"
      label="Moneda"
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
      clearable
      :rules="[(val) => val !== null || 'Obligatorio']"
      class="q-mt-sm"
    />
    <!-- activo -->
    <q-toggle
      v-model="formProducto.active"
      label="Activo"
      :true-value="1"
      :false-value="0"
    />

    <!-- precios -->
    <q-item-section
      v-for="nivelpartner in nivelesPartner"
      :key="nivelpartner.id"
    >
      <price-input
        :required="false"
        :label="nivelpartner.name"
        v-model="precios[nivelpartner.id]"
      />
    </q-item-section>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { sendRequest } from "src/boot/functions";
import PriceInput from "src/components/PriceInput.vue";

const props = defineProps({
  producto: {
    type: Object,
    default: null,
  },
});

const myForm = ref(null);

const categorias = ref([]);
const subcategorias = ref([]);
const marcas = ref([]);
const proveedores = ref([]);
const nivelesPartner = ref([]);
const precios = ref({});
const monedas = ref([]);

const formProducto = ref({
  id: null,
  name: null,
  brand_id: null,
  vendor_id: null,
  sku: null,
  description: null,
  active: 1,
  currency_id: null,
  category_id: null,
  subcategory_id: null,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/product-riego/options"
  );
  if (res) {
    categorias.value = res.categorias || [];
    subcategorias.value = res.subcategorias || [];
    marcas.value = res.marcas || [];
    proveedores.value = res.proveedores || [];
    nivelesPartner.value = res.nivelesPartner || [];
    monedas.value = res.monedas || [];
  }
};

const subcategoriasFiltradas = computed(() => {
  if (!formProducto.value.category_id) return [];

  return subcategorias.value.filter(
    (sub) => sub.category_id === formProducto.value.category_id
  );
});

const loadProducto = (prod) => {
  if (!prod) return;

  formProducto.value = {
    id: prod.id ?? null,
    name: prod.name ?? null,
    brand_id: prod.brand_id ?? null,
    vendor_id: prod.vendor_id ?? null,
    sku: prod.sku ?? null,
    description: prod.description ?? null,
    active: prod.active ?? 0,
    currency_id: prod.currency_id ?? null,
    category_id: prod.category_id ?? null,
    subcategory_id: prod.subcategory_id ?? null,
  };

  precios.value = {};
  if (Array.isArray(prod.precios)) {
    prod.precios.forEach((p) => {
      precios.value[p.nivel_partner_id] = Number(p.precio);
    });
  }
};

const validate = async () => {
  return await myForm.value.validate();
};

watch(
  () => formProducto.value.category_id,
  (newVal, oldVal) => {
    if (oldVal !== undefined && oldVal !== null && newVal !== oldVal) {
      formProducto.value.subcategory_id = null;
    }
  }
);

watch(
  () => props.producto,
  (newVal) => {
    if (newVal) {
      loadProducto(newVal);
    }
  },
  { immediate: true }
);

onMounted(() => {
  getOptions();
});

defineExpose({
  formProducto,
  precios,
  validate,
});
</script>
