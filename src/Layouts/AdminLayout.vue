<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
      <div class="sidebar-header">
        <h2 v-if="!isSidebarCollapsed">VinzStock</h2>
        <h2 v-else>VS</h2>
        <button @click="toggleSidebar" class="toggle-btn">
          {{ isSidebarCollapsed ? '→' : '←' }}
        </button>

    

      </div>

      <nav class="sidebar-nav">

        <!-- puede reusarse luego para agregar opcion de de ver datos persolnales-->
        <!--
        <router-link to="/admin/dashboard" class="nav-item">
          <span class="icon">📊</span>
          <span v-if="!isSidebarCollapsed" class="text">Dashboard</span>
        </router-link>
        -->




        <router-link to="/admin/adminOptions" class="nav-item">
          <span class="icon">⚙️</span>
          <span v-if="!isSidebarCollapsed" class="text">Opciones de Administrador</span>
        </router-link>


        <!--
        <router-link to="/admin/configuracion" class="nav-item">
          <span class="icon">⚙️</span>
          <span v-if="!isSidebarCollapsed" class="text">Configuración</span>
        </router-link>
        -->

        <router-link to="/admin/inventario" class="nav-item">
          <span class="icon">📦</span>
          <span v-if="!isSidebarCollapsed" class="text">Inventario</span>
        </router-link>

        <router-link to="/admin/proveedores" class="nav-item">
          <span class="icon">⭐</span>
          <span v-if="!isSidebarCollapsed" class="text">Proveedores</span>
        </router-link>

        <router-link to="/admin/ventas" class="nav-item">
          <span class="icon">💰</span>
          <span v-if="!isSidebarCollapsed" class="text">Ventas</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="nav-item logout-btn">
          <span class="icon">🚪</span>
          <span v-if="!isSidebarCollapsed" class="text">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Contenido principal -->
    <div class="main-content">
      <!-- Navbar -->
      <header class="navbar">
        <div class="navbar-left">
          <h1>{{ pageTitle }}</h1>
        </div>

        <div class="navbar-right">
          <NotificationButton />
          <div class="user-info">
            <div class="user-avatar">{{ userInitials }}</div>
            <div class="user-details">
              <span class="user-name">{{ usuario?.nombre }}</span>
              <span class="user-role">{{ usuario?.nombreRol }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Vista actual -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import NotificationButton from '@/composables/NotificacionButton.vue'




const router = useRouter()
const route = useRoute()
const { usuario, userInitials, logout } = useAuth()

const isSidebarCollapsed = ref(false)

const pageTitle = computed(() => {
  const titles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/usuarios': 'Gestión de Usuarios',
    '/admin/crear-usuario': 'Crear Nuevo Usuario',
    '/admin/inventario': 'Inventario',
    '/admin/configuracion': 'Configuración',
    '/admin/proveedores' : 'Proveedores',
    '/admin/ventas': 'Ventas', 
    '/admin/ventas/crear-cliente':'Crear Cliente'
  }
  return titles[route.path] || 'Panel de Administración'
})

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

function handleLogout() {
  if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
    logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}




/* Sidebar */
.sidebar {
  width: 260px;
  background: linear-gradient(135deg, #6257f3 0%, #000000 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  transition: transform 0.2s;
}

.toggle-btn:hover {
  transform: scale(1.2);
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

/* ---------- NAV ITEM ACTUALIZADO ---------- */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  font-size: 14px;
  border-radius: 2px; /* Igual que logout */
}

.nav-item:hover {
  background: linear-gradient(135deg, #6257f3 0%, #000000 100%);/* Más visible */
  color: #ffffff;
  transform: translateX(3px);  /* ligero movimiento */
}

/* Activo */
.nav-item.router-link-active {
  background: linear-gradient(135deg, #6257f3 0%, #000000 100%);
  color: #ffffff;
  border-right: 3px solid #000000;
  transform: none;
}

.nav-item .icon {
  font-size: 20px;
  min-width: 24px;
}

/* Footer - Logout */
.sidebar-footer {
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.08);
  border-radius: 5px;
  transition: all 0.25s ease;
}

.logout-btn:hover {
  background-color: rgba(239, 68, 68, 0.2);
  color: white;
  transform: translateX(1px);
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed ~ .main-content {
  margin-left: 80px;
}

/* Navbar */
.navbar {
  background: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar-left h1 {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
  font-weight: 600;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #2a0f14;
}

.user-role {
  font-size: 12px;
  color: #64748b;
}

/* Content */
.content {
  flex: 1;
  padding: 40px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.collapsed {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }

  .content {
    padding: 20px;
  }
}
</style>
