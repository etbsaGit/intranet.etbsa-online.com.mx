<template>
  <q-input v-model="inputValue" @focus="onFocus" @blur="onBlur" outlined :label="label" prefix="$"
    input-class="text-right" :rules="rules" lazy-rules />
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: [Number, String],
  label: String,
  required: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref('');
const isFocused = ref(false);

// 🔥 formatear bonito
const formatCurrency = (val) => {
  if (val === null || val === '' || val === undefined) return '';
  return Number(val).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// 🔥 limpiar número
const parseNumber = (val) => {
  if (!val) return null;
  return parseFloat(val.toString().replace(/,/g, ''));
};

const cleanInput = (val) => {
  if (val === null || val === undefined) return '';

  // 🔥 convertir a string SIEMPRE
  let clean = String(val);

  // 1. quitar todo lo que no sea número o punto
  clean = clean.replace(/[^\d.]/g, '');

  // 2. evitar más de un punto decimal
  const firstDotIndex = clean.indexOf('.');
  if (firstDotIndex !== -1) {
    const beforeDot = clean.slice(0, firstDotIndex);
    const afterDot = clean
      .slice(firstDotIndex + 1)
      .replace(/\./g, '');

    clean = beforeDot + '.' + afterDot;
  }

  // 3. limitar a 2 decimales
  if (clean.includes('.')) {
    const [int, dec] = clean.split('.');
    clean = int + '.' + (dec || '').slice(0, 2);
  }

  return clean;
};

// 👉 mientras escribe (SIN formato)
watch(inputValue, (val) => {
  if (isFocused.value) {
    const clean = cleanInput(val ?? '');
    inputValue.value = clean;
    emit('update:modelValue', parseNumber(clean));
  }
});

// 👉 focus → quitar formato
const onFocus = () => {
  isFocused.value = true;
  inputValue.value = props.modelValue ?? '';
};

// 👉 blur → aplicar formato
const onBlur = () => {
  isFocused.value = false;
  inputValue.value = formatCurrency(props.modelValue);
};

// 👉 sync cuando viene del backend (edición)
watch(
  () => props.modelValue,
  (val) => {
    if (!isFocused.value) {
      inputValue.value = formatCurrency(val);
    }
  },
  { immediate: true }
);

// reglas
const rules = computed(() => [
  val => {
    if (!props.required && (val === null || val === '')) return true;
    return val !== null && val !== '' || 'Obligatorio';
  },
  val => {
    if (!val) return true;

    const num = Number(val);

    if (isNaN(num)) return true; // 👈 clave

    return num >= 0 || 'No puede ser negativo';
  }
]);
</script>
