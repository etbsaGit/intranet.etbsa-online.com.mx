<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-img
            src="../assets/logo.png"
            spinner-color="white"
            style="max-width: 10%"
          />
          Intranet ETBSA
        </q-toolbar-title>

        <!-- <div>ETBSA v{{ $q.version }}</div> -->
        <q-btn
          v-if="!auth.user"
          label="Login"
          class="q-ml-md"
          size="sm"
          color="blue"
          to="/login"
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";

const auth = useAuthStore();
const { login } = auth;
const { user } = storeToRefs(auth);
</script>
