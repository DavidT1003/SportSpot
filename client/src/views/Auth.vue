<template>
  <div class="container" style="max-width: 420px">
    <div class="text-center my-4">
      <h1 class="fw-bold">SportSpot</h1>
      <p class="text-muted">Pronađi i organiziraj sportske događaje</p>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-4">
        <h4 class="card-title mb-3">
          {{ isLogin ? "Prijava" : "Registracija" }}
        </h4>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
        <div v-if="success" class="alert alert-success py-2">{{ success }}</div>

        <form @submit.prevent="submit">
          <template v-if="!isLogin">
            <div class="mb-3">
              <label class="form-label">Ime</label>
              <input v-model="form.ime" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Prezime</label>
              <input v-model="form.prezime" type="text" class="form-control" />
            </div>
          </template>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Lozinka</label>
            <input v-model="form.password" type="password" class="form-control" />
          </div>

          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            {{ loading ? "Molimo pričekajte..." : isLogin ? "Prijavi se" : "Registriraj se" }}
          </button>
        </form>

        <div class="text-center mt-3">
          <button class="btn btn-link" @click="toggleMode">
            {{ isLogin ? "Nemaš račun? Registriraj se" : "Već imaš račun? Prijavi se" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import api from "../api.js";

const router = useRouter();

const isLogin = ref(true);
const loading = ref(false);
const error = ref("");
const success = ref("");

const form = reactive({
  ime: "",
  prezime: "",
  email: "",
  password: "",
});

function toggleMode() {
  isLogin.value = !isLogin.value;
  error.value = "";
  success.value = "";
}

async function submit() {
  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    const url = isLogin.value ? "/auth/login" : "/auth/register";
    const { data } = await api.post(url, { ...form });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    router.push("/home");
  } catch (err) {
    error.value = err.response?.data?.message || "Došlo je do greške.";
  } finally {
    loading.value = false;
  }
}
</script>
