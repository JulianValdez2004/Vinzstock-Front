<template>
  <div class="notification-container" ref="containerRef">
    <button class="notification-btn" @click="togglePanel">
      🔔 Notificaciones
      <span v-if="count > 0" class="notification-badge">
        {{ count }}
      </span>
    </button>
    
    <div v-if="showPanel" class="notification-panel" @click.stop>
      <div class="notification-header">
        Productos con inventario bajo
      </div>
      
      <div class="notification-list">
        <div v-if="loading" class="notification-empty">
          Cargando...
        </div>
        
        <div 
          v-else-if="notificaciones.length === 0" 
          class="notification-empty"
        >
          ✅ No hay productos con inventario bajo
        </div>
        
        <div 
          v-else 
          v-for="(notif, index) in notificaciones" 
          :key="index"
          class="notification-item"
        >
          <span class="notification-icon">⚠️</span>
          <span>{{ notif }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import useNotificacionViewModel from '@/ViewModels/NotificacionViewModel.js';



export default {
  name: 'NotificationButton',
  
  setup() {
    const containerRef = ref(null);
    const viewModel = useNotificacionViewModel();
    
    const handleClickOutside = (event) => {
      if (containerRef.value && !containerRef.value.contains(event.target)) {
        viewModel.cerrarPanel();
      }
    };
    
    onMounted(() => {
      viewModel.iniciarActualizacion();
      document.addEventListener('click', handleClickOutside);
    });
    
    onUnmounted(() => {
      viewModel.detenerActualizacion();
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      containerRef,
      notificaciones: viewModel.notificaciones,
      count: viewModel.count,
      loading: viewModel.loading,
      showPanel: viewModel.showPanel,
      togglePanel: viewModel.togglePanel
    };
  }
};
</script>

<style scoped>
.notification-container {
  position: relative;
  display: inline-block;
}

.notification-btn {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.notification-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #f44336;
  color: white;
  border-radius: 50%;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.notification-panel {
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 320px;
  max-width: 400px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.notification-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 8px 8px 0 0;
  font-weight: bold;
}

.notification-list {
  max-height: 350px;
  overflow-y: auto;
}

.notification-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f5f5f5;
}

.notification-icon {
  color: #ff9800;
  font-size: 24px;
  margin-right: 10px;
  flex-shrink: 0;
}

.notification-empty {
  padding: 30px;
  text-align: center;
  color: #999;
}

/* Responsive */
@media (max-width: 768px) {
  .notification-panel {
    right: -10px;
    min-width: 280px;
  }
}
</style>