<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-dark bg-primary mb-4">
      <div class="container">
        <router-link to="/home" class="navbar-brand fw-bold">SportSpot</router-link>
        <div class="d-flex align-items-center">
          <template v-if="jePrijavljen">
            <router-link to="/home" class="btn btn-outline-light btn-sm me-2">Oglasi</router-link>
            <button class="btn btn-outline-light btn-sm" @click="logout">Odjava</button>
          </template>
          <router-link v-else to="/" class="btn btn-outline-light btn-sm">Prijavi se</router-link>
        </div>
      </div>
    </nav>

    <div class="container" style="max-width: 720px">
      <div v-if="loading" class="text-center text-muted">Učitavanje...</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

      <template v-else-if="profil">
        <!-- Zaglavlje profila -->
        <div class="card shadow-sm mb-4">
          <div class="card-body d-flex align-items-center">
            <div
              class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold me-3 flex-shrink-0"
              style="width: 64px; height: 64px; font-size: 1.5rem"
            >
              {{ inicijali }}
            </div>
            <div>
              <h4 class="mb-1">{{ profil.ime }} {{ profil.prezime }}</h4>
              <p class="mb-0 text-muted small">
                {{ posts.length }} {{ rijecOglas(posts.length) }}
                <template v-if="clanOd"> &nbsp;•&nbsp; član od {{ clanOd }}</template>
              </p>
            </div>
          </div>
        </div>

        <!-- Oglasi korisnika -->
        <h5 class="mb-3">Objavljeni oglasi</h5>

        <div v-if="posts.length === 0" class="text-center text-muted">
          Ovaj korisnik još nema objavljenih oglasa.
        </div>

        <div v-for="post in posts" :key="post._id" class="card shadow-sm mb-3">
          <div class="card-body">
            <h5 class="mb-1">
              {{ post.sport }}
              <span
                v-if="post.kapacitet"
                class="badge ms-1"
                :class="post.dolazci.length >= post.kapacitet ? 'bg-secondary' : 'bg-success'"
              >
                {{ post.dolazci.length }}/{{ post.kapacitet }} prijavljeno
              </span>
              <span v-else class="badge bg-success ms-1">
                {{ post.dolazci.length }} dolazaka
              </span>
            </h5>
            <p class="mb-1 text-muted">
              📍 {{ post.grad }}, {{ post.adresa }} &nbsp;•&nbsp; 📅 {{ post.datum }}
              <template v-if="post.vrijeme">&nbsp;•&nbsp; 🕒 {{ post.vrijeme }}</template>
            </p>
            <p v-if="post.opis" class="mt-2 mb-0">{{ post.opis }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api.js";

const route = useRoute();
const router = useRouter();

const profil = ref(null);
const posts = ref([]);
const loading = ref(true);
const error = ref("");

const jePrijavljen = computed(() => !!localStorage.getItem("token"));

const inicijali = computed(() => {
  if (!profil.value) return "";
  const i = profil.value.ime?.[0] || "";
  const p = profil.value.prezime?.[0] || "";
  return (i + p).toUpperCase();
});

const clanOd = computed(() => {
  if (!profil.value?.createdAt) return "";
  return new Date(profil.value.createdAt).toLocaleDateString("hr-HR", {
    month: "long",
    year: "numeric",
  });
});

// 1 oglas, 2 oglasa, 21 oglas...
function rijecOglas(n) {
  return n % 10 === 1 && n % 100 !== 11 ? "oglas" : "oglasa";
}

async function loadProfil(id) {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await api.get(`/users/${id}`);
    profil.value = data.user;
    posts.value = data.posts;
  } catch (err) {
    error.value = err.response?.data?.message || "Ne mogu učitati profil.";
  } finally {
    loading.value = false;
  }
}

// watch umjesto onMounted: komponenta se ne montira ponovno kad se
// s jednog profila ode na drugi, mijenja se samo parametar rute
watch(
  () => route.params.id,
  (id) => {
    if (id) loadProfil(id);
  },
  { immediate: true }
);

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/");
}
</script>
