<template>
  <q-form ref="myForm">
    <q-item>
      <q-item-section>
        <q-input
          v-model="formAnalitica.titulo"
          filled
          dense
          label="Titulo"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formAnalitica.efectivo"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Efectivo en caja"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formAnalitica.caja"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Bancos"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formAnalitica.documentospc"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Documentos por cobrar"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formAnalitica.mercancias"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Mercancias"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formAnalitica.status"
          :options="estatus"
          label="Estatus"
          option-value="value"
          option-label="label"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          options-dense
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formAnalitica.comentarios"
          filled
          dense
          label="Comentarios"
          type="textarea"
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { date } from "quasar";
import { sendRequest } from "src/boot/functions";

const { analitica, cliente } = defineProps(["analitica", "cliente"]);

const myForm = ref(null);

const estatus = ref([
  { value: 0, label: "Rechazada" },
  { value: 1, label: "Autorizada" },
  { value: null, label: "Pendiente autorizacion" },
]);

const timeStamp = Date.now();
const formattedString = date.formatDate(timeStamp, "YYYY-MM-DD");

const formAnalitica = ref({
  id: analitica ? analitica.id : null,
  titulo: analitica ? analitica.titulo : null,
  efectivo: analitica ? analitica.efectivo : 0,
  caja: analitica ? analitica.caja : 0,
  gastos: analitica ? analitica.gastos : 0,
  documentospc: analitica ? analitica.documentospc : 0,
  mercancias: analitica ? analitica.mercancias : 0,
  status: analitica ? analitica.status : null,
  fecha: analitica ? analitica.fecha : formattedString,
  comentarios: analitica ? analitica.comentarios : null,

  cliente_id: analitica ? analitica.cliente_id : cliente.id,
});

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {});

defineExpose({
  formAnalitica,
  validate,
});
</script>
