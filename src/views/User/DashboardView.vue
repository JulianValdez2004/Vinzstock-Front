<template>
  <div class="dashboard">
    <header class="dashboard-header">

      <div class="user-actions">

      </div>
    </header>

    <div class="dashboard-content">

      <!-- Información del usuario -->
      <div class="user-info">
        <div class="info-card">
          <h3>Información del Usuario</h3>
          <p><strong>Nombre:</strong> {{ usuario?.nombre }}</p>
          <p><strong>Usuario:</strong> {{ usuario?.usuarioLogin }}</p>
          <p><strong>Email:</strong> {{ usuario?.email }}</p>
          <p><strong>Rol:</strong> {{ usuario?.nombreRol }}</p>
          <p><strong>ID:</strong> {{ usuario?.idUsuario }}</p>


        </div>
      </div>



      <!-- Contenido general -->
      <div class="content">
        <p>Contenido de tu aplicación aquí...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'



const router = useRouter()
const { usuario, isAdmin, userInitials, logout } = useAuth()



</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f7fb;
}

.dashboard-header {
  background: #fff;
  padding: 20px 40px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}





.dashboard-content {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.user-info {
  margin-bottom: 40px;
}

.info-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  position: relative;
}

.info-card h3 {
  margin-bottom: 16px;
  color: #0f172a;
  font-size: 18px;
}

.info-card p {
  margin-bottom: 8px;
  color: #475569;
  font-size: 14px;
}

.info-card p strong {
  color: #0f172a;
  margin-right: 8px;
}



.content {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}
</style>