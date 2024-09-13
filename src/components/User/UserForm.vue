<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section style="max-width: 400px">
        <q-input
          v-model="formUser.name"
          filled
          dense
          label="Name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section style="max-width: 800px">
        <q-input
          v-model="formUser.email"
          filled
          dense
          label="Email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section style="max-width: 800px">
        <q-input
          v-model="formUser.password"
          filled
          dense
          label="password"
          lazy-rules
          type="password"
        />
      </q-item-section>
      <q-item-section style="max-width: 800px">
        <q-input
          v-model="formUser.confirmPassword"
          filled
          dense
          label="confirm password"
          lazy-rules
          type="password"
        />
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item>
      <q-item-section>
        <div class="text-h6">Que roles tendra el usuario</div>
      </q-item-section>
    </q-item>
    <div class="row items-start">
      <q-item v-for="role in roles" :key="role.id" class="col-4">
        <q-item-section>
          <q-toggle
            v-model="formUser.roles"
            :label="role.name"
            color="blue"
            dense
            :val="role.name"
          />
        </q-item-section>
      </q-item>
    </div>
    <q-separator />
    <q-item>
      <q-item-section>
        <div class="text-h6">Que permisos tendra el usuario</div>
      </q-item-section>
    </q-item>
    <div class="row items-start">
      <q-item
        v-for="permission in permissions"
        :key="permission.id"
        class="col-4"
      >
        <q-item-section>
          <q-toggle
            v-model="formUser.permissions"
            :label="permission.name"
            color="purple"
            dense
            :val="permission.name"
          />
        </q-item-section>
      </q-item>
    </div>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
const { user } = defineProps(["user"]);

const myForm = ref(null);
const roles = ref([]);
const permissions = ref([]);

const formUser = ref({
  id: user ? user.id : null,
  name: user ? user.name : null,
  email: user ? user.email : null,
  password: null,
  confirmPassword: null,
  roles: [],
  permissions: [],
});

const getAll = async () => {
  let res = await sendRequest("GET", null, "/api/user/role/permission/all", "");
  roles.value = res.roles;
  permissions.value = res.permissions;
};

const validate = async () => {
  return await myForm.value.validate();
};

const marcarRoles = () => {
  if (user) {
    for (const role of user.roles) {
      formUser.value.roles.push(role.name);
    }
  }
};
const marcarPermissions = () => {
  if (user) {
    for (const permission of user.permissions) {
      formUser.value.permissions.push(permission.name);
    }
  }
};

onMounted(() => {
  getAll();
  marcarRoles();
  marcarPermissions();
});

defineExpose({
  formUser,
  validate,
});
</script>
