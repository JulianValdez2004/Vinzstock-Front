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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}
</style>
