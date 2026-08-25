<template>
  <q-form ref="myForm" greedy class="q-pa-xs">
    <div class="row q-col-gutter-md">
      <!-- ========================================== -->
      <!-- SECCIÓN 1: CLASIFICACIÓN Y DATOS GENERALES -->
      <!-- ========================================== -->
      <div class="col-12">
        <div
          class="text-subtitle1 text-weight-bold text-primary flex items-center q-mb-xs"
        >
          <q-icon name="info" size="20px" class="q-mr-xs" />
          Información General
        </div>
      </div>

      <!-- Subcategoría -->
      <div class="col-12 col-md-4">
        <q-select
          v-model="formProducto.subcategory_id"
          :options="subcategoriasFiltradas"
          label="Sub Categoría *"
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
        >
          <template #prepend>
            <q-icon name="category" size="xs" color="grey-6" />
          </template>
        </q-select>
      </div>

      <!-- Marca -->
      <div class="col-12 col-sm-6 col-md-4">
        <q-select
          v-model="formProducto.brand_id"
          :options="marcas"
          label="Marca *"
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
        >
          <template #prepend>
            <q-icon name="branding_watermark" size="xs" color="grey-6" />
          </template>
        </q-select>
      </div>

      <!-- Proveedor -->
      <div class="col-12 col-sm-6 col-md-4">
        <q-select
          v-model="formProducto.vendor_id"
          :options="proveedores"
          label="Proveedor *"
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
        >
          <template #prepend>
            <q-icon name="local_shipping" size="xs" color="grey-6" />
          </template>
        </q-select>
      </div>

      <!-- Nombre del Producto -->
      <div class="col-12 col-md-8">
        <q-input
          v-model="formProducto.name"
          outlined
          dense
          label="Nombre del Producto *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template #prepend>
            <q-icon name="inventory_2" size="xs" color="grey-6" />
          </template>
        </q-input>
      </div>

      <!-- SKU -->
      <div class="col-12 col-md-4">
        <q-input
          v-model="formProducto.sku"
          outlined
          dense
          label="SKU / Código *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template #prepend>
            <q-icon name="qr_code" size="xs" color="grey-6" />
          </template>
        </q-input>
      </div>

      <!-- Descripción -->
      <div class="col-12">
        <q-input
          type="textarea"
          v-model="formProducto.description"
          outlined
          dense
          autogrow
          rows="2"
          label="Descripción *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template #prepend>
            <q-icon name="description" size="xs" color="grey-6" />
          </template>
        </q-input>
      </div>

      <!-- Moneda -->
      <div class="col-12 col-sm-6">
        <q-select
          v-model="formProducto.currency_id"
          :options="monedas"
          label="Moneda *"
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
        >
          <template #prepend>
            <q-icon name="attach_money" size="xs" color="grey-6" />
          </template>
        </q-select>
      </div>

      <!-- Estado Activo / Inactivo -->
      <div class="col-12 col-sm-6">
        <q-card
          flat
          bordered
          class="full-width q-px-md flex items-center justify-between"
          style="min-height: 40px; border-radius: 4px; background: #fafafa"
        >
          <div class="flex items-center text-body2 text-grey-8">
            <q-icon
              :name="formProducto.active ? 'check_circle' : 'cancel'"
              :color="formProducto.active ? 'positive' : 'grey'"
              size="sm"
              class="q-mr-sm"
            />
            <span>
              Estado:
              <strong
                :class="formProducto.active ? 'text-positive' : 'text-grey'"
              >
                {{ formProducto.active ? "Activo" : "Inactivo" }}
              </strong>
            </span>
          </div>
          <q-toggle
            v-model="formProducto.active"
            color="positive"
            :true-value="1"
            :false-value="0"
          />
        </q-card>
      </div>

      <!-- ========================================== -->
      <!-- SECCIÓN 2: FOTOGRAFÍAS                     -->
      <!-- ========================================== -->
      <div class="col-12">
        <q-card
          flat
          bordered
          class="q-pa-md bg-grey-1"
          style="border-radius: 8px"
        >
          <div class="row items-center justify-between q-mb-sm">
            <div
              class="text-subtitle2 text-weight-bold text-primary flex items-center"
            >
              <q-icon name="photo_library" size="20px" class="q-mr-xs" />
              Fotografías del Producto
            </div>
            <div class="text-caption text-grey-6">
              Formatos: JPG, PNG, WEBP (se optimizan automáticamente)
            </div>
          </div>

          <!-- Input para subir fotos -->
          <q-file
            v-model="selectedFiles"
            label="Seleccionar o arrastrar imágenes"
            outlined
            dense
            multiple
            bg-color="white"
            accept="image/*"
            append
            @update:model-value="onFilesSelected"
          >
            <template #prepend>
              <q-icon name="add_a_photo" color="primary" />
            </template>
          </q-file>

          <!-- Vista previa de fotos nuevas por subir -->
          <div v-if="imagenesBase64.length > 0" class="q-mt-md">
            <div
              class="text-caption text-primary text-weight-bold q-mb-xs flex items-center"
            >
              <q-icon name="cloud_upload" size="xs" class="q-mr-xs" />
              Fotos nuevas pendientes por guardar ({{ imagenesBase64.length }}):
            </div>
            <div class="row q-gutter-sm">
              <div
                v-for="(img, idx) in imagenesBase64"
                :key="idx"
                class="relative-position shadow-1 rounded-borders"
              >
                <q-img
                  :src="img"
                  style="
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                    border: 2px solid #21ba45;
                  "
                  fit="cover"
                />
                <q-btn
                  round
                  dense
                  size="xs"
                  color="red"
                  icon="close"
                  class="absolute-top-right shadow-2"
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
            <div
              class="text-caption text-grey-8 text-weight-bold q-mb-xs flex items-center"
            >
              <q-icon
                name="check_circle"
                size="xs"
                color="positive"
                class="q-mr-xs"
              />
              Fotos guardadas actualmente:
            </div>
            <div class="row q-gutter-sm">
              <div
                v-for="img in imagenesExistentes"
                :key="img.id"
                class="relative-position shadow-1 rounded-borders"
              >
                <q-img
                  :src="img.url"
                  style="
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                    border: 2px solid #1976d2;
                  "
                  fit="cover"
                />
                <q-btn
                  round
                  dense
                  size="xs"
                  color="red"
                  icon="delete"
                  class="absolute-top-right shadow-2"
                  style="top: -6px; right: -6px"
                  @click="deleteExistingImage(img)"
                >
                  <q-tooltip>Eliminar foto</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- ========================================== -->
      <!-- SECCIÓN 3: PRECIOS POR NIVEL DE PARTNER    -->
      <!-- ========================================== -->
      <div class="col-12" v-if="nivelesPartner && nivelesPartner.length > 0">
        <q-card
          flat
          bordered
          class="q-pa-md bg-grey-1"
          style="border-radius: 8px"
        >
          <div
            class="text-subtitle2 text-weight-bold text-primary flex items-center q-mb-md"
          >
            <q-icon name="payments" size="20px" class="q-mr-xs" />
            Precios por Nivel de Partner
          </div>
          <div class="row q-col-gutter-md">
            <div
              v-for="nivelpartner in nivelesPartner"
              :key="nivelpartner.id"
              class="col-12 col-sm-6 col-md-4"
            >
              <price-input
                :required="false"
                :label="nivelpartner.name"
                v-model="precios[nivelpartner.id]"
                bg-color="white"
                dense
              />
            </div>
          </div>
        </q-card>
      </div>
    </div>
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

const setDefaultOptions = () => {
  if (!formProducto.value.brand_id && marcas.value.length > 0) {
    const rivulisMarca = marcas.value.find(
      (m) => m.name && m.name.trim().toUpperCase() === "RIVULIS"
    );
    if (rivulisMarca) {
      formProducto.value.brand_id = rivulisMarca.id;
    }
  }

  if (!formProducto.value.vendor_id && proveedores.value.length > 0) {
    const rivulisProveedor = proveedores.value.find(
      (p) => p.name && p.name.trim().toUpperCase() === "RIVULIS"
    );
    if (rivulisProveedor) {
      formProducto.value.vendor_id = rivulisProveedor.id;
    }
  }
};

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/product-riego/options"
  );
  if (res) {
    formProducto.value.category_id = res.categorias ? res.categorias.id : null;
    subcategorias.value = res.subcategorias || [];
    marcas.value = res.marcas || [];
    proveedores.value = res.proveedores || [];
    nivelesPartner.value = res.nivelesPartner || [];
    monedas.value = res.monedas || [];

    setDefaultOptions();
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

  setDefaultOptions();
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
