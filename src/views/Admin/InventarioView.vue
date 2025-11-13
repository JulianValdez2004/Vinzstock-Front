<template>
  <div class="inventario-view">
    <div class="header-section">
      <h2>Gestión de Inventario</h2>

      <div class="button-container">
        <router-link to="/admin/inventario/crearProducto" class="btn-primary">
          ➕ Crear Producto
        </router-link>
        <router-link to="/admin/inventario/editarProducto" class="btn-editar">
          ✏️ Editar Producto
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function irACrearProducto() {
  router.push('/admin/crear-producto')
}

function irAEditarProducto() {
  router.push('/admin/editar-producto')
}
</script>

<style scoped>
.inventario-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 40px;
}

.header-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.header-section h2 {
  margin: 0;
  font-size: 28px;
  color: #0f172a;
  font-weight: 600;
}

.button-container {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary {
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: #16a34a;
  color: white;
}

btn-primary:hover {
  background: #15803d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}

.btn-editar {
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.btn-editar {
  background: #0b76cc;
  color: white;
}

.btn-editar:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

@media (max-width: 640px) {
  .button-container {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .btn {
    justify-content: center;
  }
}
</style>