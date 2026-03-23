<template>
  <q-input
    v-model="model"
    outlined
    :label="label"
    prefix="$"
    mask="#.##"
    fill-mask="0"
    reverse-fill-mask
    input-class="text-right"
    lazy-rules
    :rules="rules"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  required: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

// v-model interno
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

// reglas
const rules = computed(() => [
  val => {
    if (!props.required && (val === null || val === undefined || val === '')) return true;

    const num = parseFloat(val);
    return !isNaN(num) || 'Obligatorio';
  },
  val => {
    const num = parseFloat(val);
    return isNaN(num) || num >= 0 || 'No puede ser negativo';
  }
]);

</script>
