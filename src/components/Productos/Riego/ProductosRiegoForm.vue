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

    <!-- moneda -->
    <q-item>
      <q-item-section>
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
        />
      </q-item-section>
    </q-item>

    <!-- activo -->
    <q-item>
      <q-item-section>
        <q-toggle
          v-model="formProducto.active"
          label="Activo"
          :true-value="1"
          :false-value="0"
        />
      </q-item-section>
    </q-item>

    <!-- FOTOS / IMÁGENES -->
    <q-card flat bordered class="q-ma-sm q-pa-sm">
      <div class="text-subtitle2 q-mb-sm text-grey-8">
        <q-icon name="photo_library" size="sm" class="q-mr-xs text-primary" />
        Fotografías del Producto
      </div>

      <!-- Input para subir fotos -->
      <q-file
        v-model="selectedFiles"
        label="Seleccionar una o varias fotos"
        outlined
        dense
        multiple
        accept="image/*"
        append
        @update:model-value="onFilesSelected"
      >
        <template #prepend>
          <q-icon name="add_a_photo" />
        </template>
      </q-file>

      <!-- Vista previa de fotos nuevas por subir -->
      <div v-if="imagenesBase64.length > 0" class="q-mt-sm">
        <div class="text-caption text-primary text-weight-bold q-mb-xs">
          Fotos nuevas por guardar ({{ imagenesBase64.length }}):
        </div>
        <div class="row q-gutter-sm">
          <div
            v-for="(img, idx) in imagenesBase64"
            :key="idx"
            class="relative-position"
          >
            <q-img
              :src="img"
              style="
                width: 75px;
                height: 75px;
                border-radius: 8px;
                border: 1px solid #ddd;
              "
              fit="cover"
            />
            <q-btn
              round
              dense
              flat
              size="xs"
              color="red"
              icon="cancel"
              class="absolute-top-right bg-white"
              style="top: -6px; right: -6px"
              @click="removePendingImage(idx)"
            >
              <q-tooltip>Quitar foto</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- Galería de fotos existentes en S3 -->
      <div v-if="imagenesExistentes.length > 0" class="q-mt-md">
        <div class="text-caption text-grey-8 text-weight-bold q-mb-xs">
          Fotos guardadas actualmente:
        </div>
        <div class="row q-gutter-sm">
          <div
            v-for="img in imagenesExistentes"
            :key="img.id"
            class="relative-position"
          >
            <q-img
              :src="img.url"
              style="
                width: 75px;
                height: 75px;
                border-radius: 8px;
                border: 1px solid #1976d2;
              "
              fit="cover"
            />
            <q-btn
              round
              dense
              size="xs"
              color="red"
              icon="delete"
              class="absolute-top-right"
              style="top: -6px; right: -6px"
              @click="deleteExistingImage(img)"
            >
              <q-tooltip>Eliminar foto de S3</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </q-card>

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

// Imágenes
const selectedFiles = ref(null);
const imagenesBase64 = ref([]);
const imagenesExistentes = ref([]);

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

// Conversión y compresión a WebP
const convertFileToWebp = (file, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // Convertir a formato WebP con calidad 85%
        const webpBase64 = canvas.toDataURL("image/webp", quality);
        resolve(webpBase64);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Manejo de archivos a Base64 WebP
const onFilesSelected = async (files) => {
  if (!files) return;
  const list = Array.isArray(files) ? files : [files];

  for (const file of list) {
    try {
      const webpBase64 = await convertFileToWebp(file, 0.85);
      imagenesBase64.value.push(webpBase64);
    } catch (error) {
      console.error("Error al convertir la imagen a WebP:", error);
    }
  }

  selectedFiles.value = null; // limpia el input para permitir agregar más
};

const removePendingImage = (index) => {
  imagenesBase64.value.splice(index, 1);
};

const deleteExistingImage = async (img) => {
  await sendRequest(
    "DELETE",
    null,
    `/api/intranet/product-riego-image/${img.id}`
  );
  imagenesExistentes.value = imagenesExistentes.value.filter(
    (i) => i.id !== img.id
  );
};

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

  // Cargar fotos existentes del producto
  imagenesExistentes.value = Array.isArray(prod.imagenes)
    ? [...prod.imagenes]
    : [];
  imagenesBase64.value = [];
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
  imagenesBase64,
  validate,
});
</script>
