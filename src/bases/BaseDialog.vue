<template>
  <q-dialog
    v-model="dialogModel"
    persistent
    :transition-show="transitionShow"
    :transition-hide="transitionHide"
    :maximized="maximized"
    :full-height="fullHeight"
    :full-width="fullWidth"
    :position="position"
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">{{ dialogTitle }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn label="Cerrar" color="red" @click="close" />
        </q-item-section>

        <q-item-section side v-if="hasSubmitListener">
          <q-btn :label="buttonLabel" :color="buttonColor" @click="submit" />
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section>
        <slot v-if="mode !== 'delete'" name="form" />
        <div v-else>
          <slot name="delete-message">
            ¿Seguro que quieres eliminar este registro?
          </slot>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, getCurrentInstance } from "vue";

const instance = getCurrentInstance();
const hasSubmitListener = computed(() => {
  return !!instance?.vnode.props?.onSubmit;
});

// Props y eventos
const props = defineProps({
  modelValue: Boolean,
  mode: { type: String, default: "create" }, // 'create', 'edit', 'delete'
  titleCreate: { type: String, default: "Agregar" },
  titleEdit: { type: String, default: "Editar" },
  titleDelete: { type: String, default: "Eliminar" },
  titleGet: { type: String, default: "Filtrar" },
  buttonLabelCreate: { type: String, default: "Guardar" },
  buttonLabelEdit: { type: String, default: "Actualizar" },
  buttonLabelDelete: { type: String, default: "Confirmar" },
  buttonLabelGet: { type: String, default: "Filtrar" },
  maximized: { type: Boolean, default: false },
  fullHeight: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
  position: { type: String },
  transitionShow: { type: String, default: "rotate" },
  transitionHide: { type: String, default: "rotate" },
});

const emit = defineEmits(["update:modelValue", "submit"]);

// Computed para v-model compatible con eslint
const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Cierra el diálogo
const close = () => {
  dialogModel.value = false;
};

// Emite la acción principal
const submit = () => {
  emit("submit");
};

// Título dinámico
const dialogTitle = computed(() => {
  switch (props.mode) {
    case "create":
      return props.titleCreate;
    case "edit":
      return props.titleEdit;
    case "delete":
      return props.titleDelete;
    case "filters":
      return props.titleGet;
    default:
      return "Acción";
  }
});

// Etiqueta del botón
const buttonLabel = computed(() => {
  switch (props.mode) {
    case "create":
      return props.buttonLabelCreate;
    case "edit":
      return props.buttonLabelEdit;
    case "delete":
      return props.buttonLabelDelete;
    case "filters":
      return props.buttonLabelGet;
    default:
      return "Aceptar";
  }
});

// Color del botón
const buttonColor = computed(() => {
  switch (props.mode) {
    case "create":
      return "blue";
    case "edit":
      return "warning";
    case "delete":
      return "negative";
    case "filters":
      return "blue";
    default:
      return "grey";
  }
});
</script>
