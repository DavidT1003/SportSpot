<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-dark bg-primary mb-4">
      <div class="container">
        <span class="navbar-brand fw-bold">SportSpot</span>
        <div class="d-flex align-items-center text-white">
          <span class="me-3 d-none d-sm-inline">Bok, {{ user.ime }}!</span>
          <router-link
            v-if="user.id"
            :to="`/profil/${user.id}`"
            class="btn btn-outline-light btn-sm me-2"
          >
            Moj profil
          </router-link>
          <button class="btn btn-outline-light btn-sm" @click="logout">Odjava</button>
        </div>
      </div>
    </nav>

    <div class="container" style="max-width: 720px">
      <!-- Forma za novi oglas -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="card-title mb-3">Novi oglas</h5>

          <div v-if="formError" class="alert alert-danger py-2">{{ formError }}</div>

          <form @submit.prevent="createPost">
            <div class="row g-2">
              <div class="col-md-6">
                <input v-model="newPost.sport" class="form-control" placeholder="Sport (npr. Nogomet)" />
              </div>
              <div class="col-md-6">
                <input v-model="newPost.grad" class="form-control" placeholder="Grad" />
              </div>
              <div class="col-md-6">
                <input v-model="newPost.adresa" class="form-control" placeholder="Adresa / lokacija" />
              </div>
              <div class="col-md-6">
                <input v-model="newPost.datum" type="date" class="form-control" />
              </div>
              <div class="col-12">
                <textarea
                  v-model="newPost.opis"
                  class="form-control"
                  rows="2"
                  placeholder="Opis (nije obavezno)"
                ></textarea>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Objavi</button>
          </form>
        </div>
      </div>

      <!-- Feed oglasa -->
      <div v-if="loading" class="text-center text-muted">Učitavanje...</div>
      <div v-else-if="posts.length === 0" class="text-center text-muted">
        Nema oglasa. Budi prvi koji će objaviti!
      </div>

      <div v-for="post in posts" :key="post._id" class="card shadow-sm mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5 class="mb-1">
                {{ post.sport }}
                <span class="badge bg-success ms-1">{{ post.dolazci.length }} dolazaka</span>
              </h5>
              <p class="mb-1 text-muted">
                📍 {{ post.grad }}, {{ post.adresa }} &nbsp;•&nbsp; 📅 {{ post.datum }}
              </p>
              <p class="mb-1 small text-secondary">
                Objavio:
                <router-link
                  v-if="post.user?._id"
                  :to="`/profil/${post.user._id}`"
                  class="text-decoration-none"
                >
                  {{ post.user.ime }} {{ post.user.prezime }}
                </router-link>
                <span v-else>nepoznat korisnik</span>
              </p>
            </div>
          </div>

          <!-- Opis / uređivanje -->
          <div v-if="editingId === post._id" class="mt-2">
            <textarea v-model="editText" class="form-control mb-2" rows="2"></textarea>
            <button class="btn btn-sm btn-success me-2" @click="saveEdit(post)">Spremi</button>
            <button class="btn btn-sm btn-secondary" @click="cancelEdit">Odustani</button>
          </div>
          <p v-else-if="post.opis" class="mt-2 mb-0">{{ post.opis }}</p>

          <!-- Akcije -->
          <div class="mt-3 d-flex gap-2">
            <button
              v-if="!isOwner(post) && editingId !== post._id"
              class="btn btn-sm btn-outline-primary"
              @click="joinPost(post)"
            >
              + Pridruži se
            </button>

            <template v-if="isOwner(post) && editingId !== post._id">
              <button class="btn btn-sm btn-outline-secondary" @click="startEdit(post)">
                Uredi opis
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deletePost(post)">
                Obriši
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api.js";

const router = useRouter();
const user = JSON.parse(localStorage.getItem("user") || "{}");

const posts = ref([]);
const loading = ref(true);
const formError = ref("");

const newPost = reactive({ sport: "", grad: "", adresa: "", datum: "", opis: "" });

const editingId = ref(null);
const editText = ref("");

function isOwner(post) {
  return post.user?._id === user.id;
}

async function loadPosts() {
  loading.value = true;
  try {
    const { data } = await api.get("/posts");
    posts.value = data;
  } catch {
    // ignore
  } finally {
    loading.value = false;
  }
}

async function createPost() {
  formError.value = "";
  try {
    await api.post("/posts", { ...newPost });
    Object.assign(newPost, { sport: "", grad: "", adresa: "", datum: "", opis: "" });
    await loadPosts();
  } catch (err) {
    formError.value = err.response?.data?.message || "Greška pri objavi.";
  }
}

async function joinPost(post) {
  try {
    await api.post(`/posts/${post._id}/join`);
    await loadPosts();
  } catch (err) {
    alert(err.response?.data?.message || "Greška.");
  }
}

function startEdit(post) {
  editingId.value = post._id;
  editText.value = post.opis;
}

function cancelEdit() {
  editingId.value = null;
  editText.value = "";
}

async function saveEdit(post) {
  try {
    await api.put(`/posts/${post._id}`, { opis: editText.value });
    cancelEdit();
    await loadPosts();
  } catch (err) {
    alert(err.response?.data?.message || "Greška.");
  }
}

async function deletePost(post) {
  if (!confirm("Sigurno želiš obrisati ovaj oglas?")) return;
  try {
    await api.delete(`/posts/${post._id}`);
    await loadPosts();
  } catch (err) {
    alert(err.response?.data?.message || "Greška.");
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/");
}

onMounted(loadPosts);
</script>
