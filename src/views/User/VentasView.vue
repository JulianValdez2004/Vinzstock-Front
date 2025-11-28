<template>
  <div class="Cajeroventas-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h1>Módulo de Ventas</h1>
          <p class="subtitle">Gestiona los clientes del sistema</p>
        </div>
        <button class="btn btn-primary" @click="irACrearCliente">
          <span class="icon">➕</span>
          Crear Cliente
        </button>
      </div>

      <!-- Card de búsqueda y lista -->
      <div class="card-content">
        <!-- Barra de búsqueda -->
        <div class="search-section">
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input
                v-model="viewModel.searchTerm.value"
                type="text"
                class="search-input"
                placeholder="Buscar por nombre o documento..."
                @input="viewModel.buscarClientes()"
            />
            <button
                v-if="viewModel.searchTerm.value"
                class="btn-clear"
                @click="viewModel.limpiarBusqueda()"
                title="Limpiar búsqueda"
            >
              ✕
            </button>
          </div>

          <!-- Filtros y contador -->
          <div class="filters">
            <span class="results-count">
              {{ viewModel.hayClientes.value ? viewModel.contadorResultados.value : 'Sin resultados' }}
            </span>
            <button 
              class="btn-reload" 
              @click="viewModel.recargar()"
              :disabled="viewModel.isLoading.value"
              title="Recargar"
            >
              <span class="icon-reload" :class="{ 'spinning': viewModel.isLoading.value }">🔄</span>
            </button>
          </div>
        </div>

        <!-- Mensaje de error -->
        <transition name="fade">
          <div v-if="viewModel.error.value" class="alert alert-danger">
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
              <strong>Error</strong>
              <p>{{ viewModel.error.value }}</p>
            </div>
            <button class="btn-close-alert" @click="viewModel.clearError()">✕</button>
          </div>
        </transition>

        <!-- Loading -->
        <div v-if="viewModel.isLoading.value" class="loading-container">
          <div class="spinner-large"></div>
          <p>Cargando clientes...</p>
        </div>

        <!-- Lista de clientes (Grid de tarjetas) -->
        <div v-else-if="viewModel.hayClientes.value" class="clientes-grid">
          <div
              v-for="cliente in viewModel.clientesFiltrados.value"
              :key="cliente.idCliente"
              class="cliente-card"
              @click="viewModel.verDetalles(cliente)"
          >
            <div class="card-header">
              <div class="cliente-avatar">
                {{ cliente.getInitials() }}
              </div>
              <div class="cliente-info">
                <h3 class="cliente-nombre">{{ cliente.nombreRazonSocial }}</h3>
                <div class="cliente-meta">
                  <span class="tipo-documento">
                    {{ viewModel.getIconoTipoDocumento(cliente) }} 
                    {{ cliente.getTipoDocumento() }}
                  </span>
                  <span class="documento-numero">
                    {{ viewModel.formatearDocumento(cliente) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <span 
                class="badge" 
                :class="viewModel.getEstadoClass(cliente)"
              >
                {{ cliente.getEstadoTexto() }}
              </span>
              <button class="btn-ver-detalles" @click.stop="viewModel.verDetalles(cliente)">
                Ver detalles →
              </button>
            </div>
          </div>
        </div>

        <!-- Sin resultados -->
        <div v-else class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>
            {{ viewModel.searchTerm.value ? 'No se encontraron resultados' : 'No hay clientes registrados' }}
          </h3>
          <p v-if="viewModel.searchTerm.value">
            No se encontraron clientes que coincidan con "{{ viewModel.searchTerm.value }}"
          </p>
          <p v-else>
            Comienza agregando tu primer cliente para gestionar ventas
          </p>
          <button 
            v-if="!viewModel.searchTerm.value" 
            class="btn btn-primary" 
            @click="irACrearCliente"
          >
            <span class="icon">➕</span>
            Agregar Primer Cliente
          </button>
          <button 
            v-else 
            class="btn btn-secondary" 
            @click="viewModel.limpiarBusqueda()"
          >
            Limpiar búsqueda
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <transition name="modal">
      <div 
        v-if="viewModel.mostrarModal.value" 
        class="modal-overlay" 
        @click="viewModel.cerrarModal()"
      >
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Detalles del Cliente</h3>
            <button class="btn-close" @click="viewModel.cerrarModal()">✕</button>
          </div>

          <div class="modal-body" v-if="viewModel.clienteSeleccionado.value">
            <div class="detail-section">
              <h4>Información General</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">ID</span>
                  <span class="detail-value">#{{ viewModel.clienteSeleccionado.value.idCliente }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Nombre / Razón Social</span>
                  <span class="detail-value">{{ viewModel.clienteSeleccionado.value.nombreRazonSocial }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Tipo de Documento</span>
                  <span class="detail-value">
                    {{ viewModel.getIconoTipoDocumento(viewModel.clienteSeleccionado.value) }}
                    {{ viewModel.clienteSeleccionado.value.getTipoDocumento() }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Número de Documento</span>
                  <span class="detail-value documento-formato">
                    {{ viewModel.formatearDocumento(viewModel.clienteSeleccionado.value) }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Estado</span>
                  <span 
                    class="badge"
                    :class="viewModel.getEstadoClass(viewModel.clienteSeleccionado.value)"
                  >
                    {{ viewModel.clienteSeleccionado.value.getEstadoTexto() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="viewModel.cerrarModal()">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { VentasViewModel } from '@/ViewModels/VentasViewModel'




const router = useRouter()
const viewModel = new VentasViewModel()


const irACrearCliente = () => {

  router.push('/cajero/ventas/crear-cliente')
  

}

onMounted(async () => {
  await viewModel.loadClientes()
})
</script>

<style scoped>

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1.5rem;
}

.header-left h1 {
  color: white;
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 1rem;
}

/* Card Content */
.card-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 2rem;
}

/* Search Section */
.search-section {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-container {
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-clear {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: #e0e0e0;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-clear:hover {
  background: #d0d0d0;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-count {
  color: #7f8c8d;
  font-size: 0.95rem;
  font-weight: 500;
}

.btn-reload {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.25rem;
  transition: transform 0.3s;
}

.btn-reload:hover:not(:disabled) {
  transform: scale(1.1);
}

.btn-reload:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-reload {
  display: inline-block;
}

.icon-reload.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Alert */
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  position: relative;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-content strong {
  display: block;
  margin-bottom: 0.25rem;
}

.alert-content p {
  margin: 0;
}

.btn-close-alert {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #721c24;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.btn-close-alert:hover {
  opacity: 1;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner-large {
  width: 60px;
  height: 60px;
  border: 4px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

/* Grid de Clientes */
.clientes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.cliente-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cliente-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.cliente-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.cliente-info {
  flex: 1;
  min-width: 0;
}

.cliente-nombre {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cliente-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #7f8c8d;
}

.tipo-documento {
  font-weight: 500;
}

.documento-numero {
  font-family: 'Courier New', monospace;
  color: #555;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-activo {
  background: #d4edda;
  color: #155724;
}

.badge-inactivo {
  background: #f8d7da;
  color: #721c24;
}

.btn-ver-detalles {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.btn-ver-detalles:hover {
  color: #764ba2;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.empty-state p {
  color: #7f8c8d;
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #2c3e50;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.icon {
  font-size: 1.125rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #95a5a6;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.875rem;
  color: #7f8c8d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

.documento-formato {
  font-family: 'Courier New', monospace;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .Cajeroventas-page {
    padding: 1rem 0;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left h1 {
    font-size: 1.5rem;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .card-content {
    padding: 1rem;
  }

  .clientes-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .modal-footer .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>