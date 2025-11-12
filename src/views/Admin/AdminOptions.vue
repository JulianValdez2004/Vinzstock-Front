<template>
  <div class="admin-options">
    <h1>Panel de Administración</h1>
    <div class="actions">
      <button @click="goToListarUsuariosView">Gestión de Empleados</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ListarUsuariosView from "@/views/Admin/ListarUsuariosView.vue";

const router = useRouter()

function goToListarUsuariosView() {
  router.push({ name: 'ListarUsuarios' }) // Asegúrate de tener esta ruta definida
}
</script>

<style scoped>
.admin-options {
  padding: 2rem;
  max-width: 800px;
  margin: auto;
}

.actions {
  margin-top: 1.5rem;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1a252f;
}
</style>
