<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formMaquina.serie"
          filled
          dense
          label="serie"
          lazy-rules
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formMaquina.modelo"
          filled
          dense
          label="Modelo"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formMaquina.anio"
          :options="anios"
          label="Año"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          options-dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formMaquina.valor"
          filled
          dense
          label="Valor"
          lazy-rules
          hint
          mask="#,###,###"
          reverse-fill-mask
          unmasked-value
          input-class="text-right"
          :rules="[(val) => (val !== null && val !== '') || 'Obligatorio']"
        >
          <template v-slot:prepend>
            <q-icon name="attach_money" />
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formMaquina.marca_id"
          :options="marcas"
          label="Marca"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          options-dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formMaquina.condicion_id"
          :options="condiciones"
          label="Condicion"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          options-dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formMaquina.clas_equipo_id"
          :options="clasEquipos"
          label="Clasificacion de equipo"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          options-dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formMaquina.tipo_equipo_id"
          :options="tiposEquipo"
          label="Tipo de equipo"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          options-dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { maquina, cliente } = defineProps(["maquina", "cliente"]);

const marcas = ref([]);
const condiciones = ref([]);
const clasEquipos = ref([]);
const tiposEquipo = ref([]);
const anios = ref([
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
  2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000,
  1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989, 1988, 1987,
  1986, 1985, 1984, 1983, 1982, 1981, 1980, 1979, 1978, 1977, 1976, 1975, 1974,
  1973, 1972, 1971, 1970,
]);

const myForm = ref(null);

const formMaquina = ref({
  id: maquina ? maquina.id : null,
  serie: maquina ? maquina.serie : null,
  modelo: maquina ? maquina.modelo : null,
  anio: maquina ? maquina.anio : null,
  valor: maquina ? maquina.valor : null,
  cliente_id: maquina ? maquina.cliente_id : cliente.id,
  marca_id: maquina ? maquina.marca_id : null,
  condicion_id: maquina ? maquina.condicion_id : null,
  clas_equipo_id: maquina ? maquina.clas_equipo_id : null,
  tipo_equipo_id: maquina ? maquina.tipo_equipo_id : null,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/machine/options", "");
  marcas.value = res.marcas;
  condiciones.value = res.condiciones;
  clasEquipos.value = res.clasEquipos;
  tiposEquipo.value = res.tiposEquipo;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formMaquina,
  validate,
});
</script>
