<template>
  <q-form ref="myForm" greedy>
    <!-- categoria -->
    <q-item>
      <q-item-section>
        <q-select v-model="formProducto.category_id" :options="categorias" label="Categoría" option-value="id"
          option-label="name" option-disable="inactive" emit-value map-options transition-show="jump-up"
          transition-hide="jump-up" outlined dense options-dense clearable
          :rules="[(val) => val !== null || 'Obligatorio']" />
      </q-item-section>
    </q-item>
    <!-- subcategoria -->
    <q-item>
      <q-item-section>
        <q-select v-model="formProducto.subcategory_id" :options="subcategoriasFiltradas" label="SubCategoría" option-value="id"
          option-label="name" option-disable="inactive" emit-value map-options transition-show="jump-up"
          transition-hide="jump-up" outlined dense options-dense clearable
          :rules="[(val) => val !== null || 'Obligatorio']" />
      </q-item-section>
    </q-item>

    <!-- marca -->
    <q-item>
      <q-item-section>
        <q-select v-model="formProducto.brand_id" :options="marcas" label="Marca" option-value="id" option-label="name"
          option-disable="inactive" emit-value map-options transition-show="jump-up" transition-hide="jump-up" outlined
          dense options-dense clearable :rules="[(val) => val !== null || 'Obligatorio']" />
      </q-item-section>
    </q-item>

    <!-- proveedor -->
    <q-item>
      <q-item-section>
        <q-select v-model="formProducto.vendor_id" :options="proveedores" label="Proveedores" option-value="id"
          option-label="name" option-disable="inactive" emit-value map-options transition-show="jump-up"
          transition-hide="jump-up" outlined dense options-dense clearable
          :rules="[(val) => val !== null || 'Obligatorio']" />
      </q-item-section>
    </q-item>

    <!-- nombre -->
    <q-item>
      <q-item-section>
        <q-input v-model="formProducto.name" outlined dense label="Producto" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
      </q-item-section>
    </q-item>

    <!-- descripcion -->
    <q-item>
      <q-item-section>
        <q-input type="textarea" v-model="formProducto.description" outlined dense label="Descripción" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
      </q-item-section>
    </q-item>
    <!-- SKU -->
    <q-item>
      <q-item-section>
        <q-input v-model="formProducto.sku" outlined dense label="SKU" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
      </q-item-section>
    </q-item>
    <!--  ubicación -->
    <q-item>
      <q-item-section>
        <q-select v-model="formProducto.agency_id" :options="sucursales" label="Ubicación" option-value="id"
          option-label="nombre" option-disable="inactive" emit-value map-options transition-show="jump-up"
          transition-hide="jump-up" outlined dense options-dense clearable
          :rules="[(val) => val !== null || 'Obligatorio']" />
      </q-item-section>
    </q-item>
    <q-item>
      <!-- activo -->
      <q-toggle v-model="formProducto.active" label="Activo" :true-value="1" :false-value="0"
         />
      <!-- usado -->
      <q-toggle v-model="formProducto.is_usado" label="Es Usado" :true-value="1" :false-value="0"
         />
      <!-- is dollar -->
      <q-toggle v-model="formProducto.is_dollar" label="(Dollar) USD" :true-value="1" :false-value="0"
         />
    </q-item>

    <!-- precios -->
    <q-item-section v-for="condicion in condicionesFiltradas" :key="condicion.id">
      <price-input :required="false"  :label="condicion.name" v-model="precios[condicion.id] "/>
    </q-item-section>

  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import PriceInput from "src/components/PriceInput.vue";
import { watch, computed } from 'vue';

const { producto } = defineProps(["producto"]);

const myForm = ref(null);

const categorias = ref([]);
const subcategorias = ref([]);
const sucursales = ref([]);
const marcas = ref([]);
const proveedores = ref([]);
const precios = ref([]);

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/product/options",
  );
  categorias.value = res.categorias;
  subcategorias.value = res.subcategorias;
  sucursales.value = res.sucursales;
  marcas.value = res.marcas;
  proveedores.value = res.proveedores;
};

const subcategoriasFiltradas = computed(() =>{
  if(!formProducto.value.category_id) return [];

  return subcategorias.value.filter(
    (sub) => sub.category_id === formProducto.value.category_id
  );
});

const loadProducto = (producto) => {
  formProducto.value = producto;

  // limpiar
  precios.value = {};

  // mapear precios existentes
  producto.precios.forEach(p => {
    precios.value[p.condicion_pago_id] = Number(p.precio);
  });

  // asegurar que todas las condiciones existan (aunque no tengan precio)
  producto.category.condiciones_pago.forEach(cond => {
    if (!(cond.id in precios.value)) {
      precios.value[cond.id] = null;
    }
  });
};

const formProducto = ref({
  id: producto ? producto.id : null,
  name: producto ? producto.name : null,
  brand_id: producto ? producto.brand_id: null,
  vendor_id: producto ? producto.vendor_id: null,
  sku: producto ? producto.sku: null,
  description: producto ? producto.description: null,

  is_usado: producto?.is_usado ?? 0,
  is_dollar: producto?.is_dollar ?? 0,
  active: producto?.active ?? 0,
  currency_id: producto?.currency_id ?? (producto?.is_dollar ? 2 : 1),
  category_id: producto ? producto.category_id : null,
  subcategory_id: producto ? producto.subcategory_id : null,
  agency_id: producto ? producto.agency_id : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

const condicionesFiltradas = computed(() => {
  if(!formProducto.value.category_id) return [];

  const categoria = categorias.value.find(
    c => c.id === formProducto.value.category_id
  );
  return categoria?.condiciones_pago || [];
});


watch(
  () => formProducto.value.is_dollar,
  (val, oldVal) => {
    // Solo ejecutar si realmente cambió
    if (val === oldVal) return;

    formProducto.value.currency_id = formProducto.value.is_dollar == 1 ? 2 : 1;
  }
);

watch(
  () => formProducto.value.category_id,
  () => {
    formProducto.value.subcategory_id = null;
  }
);

watch(() => formProducto.value.category_id, (newVal, oldVal) => {
  // solo limpiar si el usuario cambia manualmente
  if (oldVal !== null && newVal !== oldVal) {
    precios.value = {};

    condicionesFiltradas.value.forEach(cond => {
      precios.value[cond.id] = null;
    });
  }
});

onMounted(() => {
  getOptions();

  if (producto) {
    loadProducto(producto);
  }
});

defineExpose({
  formProducto,
  validate,
});
</script>
