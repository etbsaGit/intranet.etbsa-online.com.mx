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
    <q-item-section>

      <price-input :required="false" v-model="formProducto.price_1" label="Precio lista"/>

      <price-input :required="false" v-model="formProducto.price_2" label="Precio contado" />

      <price-input :required="false" v-model="formProducto.price_3" label="Precio financiamiento a 2 años" />

      <price-input :required="false" v-model="formProducto.price_4" label="Precio financiamiento a 3 años sin intereses" />

      <price-input :required="false" v-model="formProducto.price_5" label="Precio financiamiento a 5 años" />

      <price-input :required="false" v-model="formProducto.price_6" label="Precio EXPO" />

      <price-input :required="false" v-model="formProducto.price_7" label="Precio por volumen" />

      <price-input :required="false" v-model="formProducto.price_8" label="Precio Renta/Arrendamiento 1 mes" />

      <price-input :required="false" v-model="formProducto.price_9" label="Precio Renta/Arrendamiento 2 meses" />

      <price-input :required="false" v-model="formProducto.price_10" label="Precio Renta/Arrendamiento 3 meses" />

      <price-input :required="false" v-model="formProducto.price_11" label="Precio Crédito 30 días" />

      <price-input :required="false" v-model="formProducto.price_12" label="Precio a Arrendadoras" />

      <price-input :required="false" v-model="formProducto.price_13"
        label="Financiado 24-0% / 12-1% / 24-5.45% / 36-7.75% / 48-9.15% / 60-10.05%" />

      <price-input :required="false" v-model="formProducto.price_14"
        label="Financiado 12-5.40% / 24-8.45% / 36-9.99% / 48-10.9% / 60-11.55%" />

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

  price_1: producto ? producto.price_1: null,
  price_2: producto ? producto.price_2: null,
  price_3: producto ? producto.price_3: null,
  price_4: producto ? producto.price_4: null,
  price_5: producto ? producto.price_5: null,
  price_6: producto ? producto.price_6: null,
  price_7: producto ? producto.price_7: null,
  price_8: producto ? producto.price_8: null,
  price_9: producto ? producto.price_9: null,
  price_10: producto ? producto.price_10: null,
  price_11: producto ? producto.price_11: null,
  price_12: producto ? producto.price_12: null,
  price_13: producto ? producto.price_13: null,
  price_14: producto ? producto.price_14: null,
  category_id: producto ? producto.category_id : null,
  subcategory_id: producto ? producto.subcategory_id : null,
  agency_id: producto ? producto.agency_id : null,
});

const validate = async () => {
  return await myForm.value.validate();
};


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

onMounted(() => {
  getOptions();
});

defineExpose({
  formProducto,
  validate,
});
</script>
