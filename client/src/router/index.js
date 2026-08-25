import { createRouter, createWebHistory } from "vue-router";
import Auth from "../views/Auth.vue";
import Home from "../views/Home.vue";

const routes = [
  { path: "/", name: "Auth", component: Auth, meta: { guestOnly: true } },
  { path: "/home", name: "Home", component: Home, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Zaštita ruta
router.beforeEach((to) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return { name: "Auth" };
  }
  if (to.meta.guestOnly && token) {
    return { name: "Home" };
  }
});

export default router;
