<template>
  <div class="proveedores-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h1>Gestión de Proveedores</h1>
          <p class="subtitle">Administra los proveedores de tu inventario</p>
        </div>
        <button class="btn btn-primary" @click="irACrear">
          <span class="icon">➕</span>
          Nuevo Proveedor
        </button>
      </div>

      <!-- Card de búsqueda y tabla -->
      <div class="card-content">
        <!-- Barra de búsqueda -->
        <div class="search-section">
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input
                v-model="terminoBusqueda"
                type="text"
                class="search-input"
                placeholder="Buscar por nombre o NIT fiscal..."
                @input="handleBuscar"
            />
            <button
                v-if="terminoBusqueda"
                class="btn-clear"
                @click="limpiarBusqueda"
                title="Limpiar búsqueda"
            >
              ✕
            </button>
          </div>

          <!-- Filtros adicionales -->
          <div class="filters">
            <span class="results-count">
              {{ hayProveedores ? `${proveedores.length} proveedor${proveedores.length !== 1 ? 'es' : ''}` : 'Sin resultados' }}
            </span>
          </div>
        </div>

        <!-- Mensajes de error -->
        <transition name="fade">
          <div v-if="errores.length > 0" class="alert alert-danger">
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
              <strong>Error</strong>
              <ul>
                <li v-for="(error, index) in errores" :key="index">{{ error }}</li>
              </ul>
            </div>
          </div>
        </transition>

        <!-- Loading -->
        <div v-if="cargando" class="loading-container">
          <div class="spinner-large"></div>
          <p>Cargando proveedores...</p>
        </div>

        <!-- Tabla de proveedores -->
        <div v-else-if="hayProveedores" class="table-container">
          <table class="table">
            <thead>
            <tr>
              <th class="th-id">ID</th>
              <th class="th-nombre">Nombre Compañía</th>
              <th class="th-nit">NIT Fiscal</th>
              <th class="th-email">Email</th>
              <th class="th-telefono">Teléfono</th>
              <th class="th-estado">Estado</th>
              <th class="th-acciones">Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="prov in proveedores"
                :key="prov.idProveedor"
                class="table-row"
            >
              <td class="td-id">
                <span class="badge badge-id">#{{ prov.idProveedor }}</span>
              </td>
              <td class="td-nombre">
                <div class="nombre-container">
                  <span class="nombre-text">{{ prov.nombre }}</span>
                </div>
              </td>
              <td class="td-nit">
                <span class="nit-text">{{ prov.nitFiscal }}</span>
              </td>
              <td class="td-email">
                <a :href="`mailto:${prov.email}`" class="email-link">
                  {{ prov.email }}
                </a>
              </td>
              <td class="td-telefono">
                  <span v-if="prov.telefono" class="telefono-text">
                    {{ formatTelefono(prov.telefono) }}
                  </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td class="td-estado">
                  <span
                      class="badge"
                      :class="getEstadoClass(prov.estado)"
                  >
                    {{ prov.estado || 'ACTIVO' }}
                  </span>
              </td>
              <td class="td-acciones">
                <div class="actions-container">
                  <button
                      class="btn-icon btn-edit"
                      @click="editarProveedor(prov)"
                      title="Editar proveedor"
                  >
                    <span class="icon">✏️</span>
                  </button>
                  <button
                      class="btn-icon btn-view"
                      @click="verDetalles(prov)"
                      title="Ver detalles"
                  >
                    <span class="icon">👁️</span>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Sin resultados -->
        <div v-else class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>{{ terminoBusqueda ? 'No se encontraron resultados' : 'No hay proveedores registrados' }}</h3>
          <p v-if="terminoBusqueda">
            No se encontraron proveedores que coincidan con "{{ terminoBusqueda }}"
          </p>
          <p v-else>
            Comienza agregando tu primer proveedor para gestionar tu inventario
          </p>
          <button v-if="!terminoBusqueda" class="btn btn-primary" @click="irACrear">
            <span class="icon">➕</span>
            Agregar Primer Proveedor
          </button>
          <button v-else class="btn btn-secondary" @click="limpiarBusqueda">
            Limpiar búsqueda
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <transition name="modal">
      <div v-if="mostrarModal" class="modal-overlay" @click="cerrarModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Detalles del Proveedor</h3>
            <button class="btn-close" @click="cerrarModal">✕</button>
          </div>

          <div class="modal-body" v-if="proveedorSeleccionado">
            <div class="detail-section">
              <h4>Información General</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">ID</span>
                  <span class="detail-value">#{{ proveedorSeleccionado.idProveedor }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Nombre</span>
                  <span class="detail-value">{{ proveedorSeleccionado.nombre }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">NIT Fiscal</span>
                  <span class="detail-value">{{ proveedorSeleccionado.nitFiscal }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Estado</span>
                  <span
                      class="badge"
                      :class="getEstadoClass(proveedorSeleccionado.estado)"
                  >
                    {{ proveedorSeleccionado.estado || 'ACTIVO' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Información de Contacto</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Email</span>
                  <a :href="`mailto:${proveedorSeleccionado.email}`" class="detail-value detail-link">
                    {{ proveedorSeleccionado.email }}
                  </a>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Teléfono</span>
                  <span class="detail-value">
                    {{ proveedorSeleccionado.telefono ? formatTelefono(proveedorSeleccionado.telefono) : 'No registrado' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="detail-section" v-if="proveedorSeleccionado.fechaPedido || proveedorSeleccionado.total">
              <h4>Información Adicional</h4>
              <div class="detail-grid">
                <div class="detail-item" v-if="proveedorSeleccionado.fechaPedido">
                  <span class="detail-label">Fecha de Registro</span>
                  <span class="detail-value">{{ formatFecha(proveedorSeleccionado.fechaPedido) }}</span>
                </div>
                <div class="detail-item" v-if="proveedorSeleccionado.total !== null">
                  <span class="detail-label">Total Pedidos</span>
                  <span class="detail-value">${{ formatMonto(proveedorSeleccionado.total) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section" v-if="proveedorSeleccionado.notas">
              <h4>Notas</h4>
              <p class="notas-text">{{ proveedorSeleccionado.notas }}</p>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cerrarModal">
              Cerrar
            </button>
            <button class="btn btn-primary" @click="editarDesdeModal">
              <span class="icon">✏️</span>
              Editar Proveedor
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProveedorViewModel } from '../viewmodels/ProveedorViewModel';

const router = useRouter();

const {
  proveedores,
  cargando,
  errores,
  hayProveedores,
  listarProveedores,
  buscarProveedores
} = useProveedorViewModel();

const terminoBusqueda = ref('');
const mostrarModal = ref(false);
const proveedorSeleccionado = ref(null);
let timeoutBusqueda = null;

onMounted(async () => {
  await listarProveedores();
});

const handleBuscar = () => {
  if (timeoutBusqueda) {
    clearTimeout(timeoutBusqueda);
  }

  timeoutBusqueda = setTimeout(async () => {
    if (terminoBusqueda.value.trim()) {
      await buscarProveedores(terminoBusqueda.value);
    } else {
      await listarProveedores();
    }
  }, 500);
};

const limpiarBusqueda = async () => {
  terminoBusqueda.value = '';
  await listarProveedores();
};

const irACrear = () => {
  router.push('/proveedores/crear');
};

const editarProveedor = (proveedor) => {
  router.push(`/proveedores/editar/${proveedor.idProveedor}`);
};

const verDetalles = (proveedor) => {
  proveedorSeleccionado.value = proveedor;
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
  proveedorSeleccionado.value = null;
};

const editarDesdeModal = () => {
  if (proveedorSeleccionado.value) {
    router.push(`/proveedores/editar/${proveedorSeleccionado.value.idProveedor}`);
  }
};

const formatTelefono = (telefono) => {
  if (!telefono) return '';
  // Formato: 300 123 4567
  return telefono.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
};

const formatFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatMonto = (monto) => {
  if (monto === null || monto === undefined) return '0.00';
  return Number(monto).toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const getEstadoClass = (estado) => {
  const estadoNorm = (estado || 'ACTIVO').toUpperCase();
  switch(estadoNorm) {
    case 'ACTIVO':
      return 'badge-success';
    case 'INACTIVO':
      return 'badge-danger';
    case 'PENDIENTE':
      return 'badge-warning';
    default:
      return 'badge-secondary';
  }
};
</script>

<style scoped>
.proveedores-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 2rem 0;
}

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
  gap: 2rem;
}

.header-left h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.subtitle {
  color: #7f8c8d;
  margin: 0;
  font-size: 1rem;
}

/* Card principal */
.card-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Búsqueda */
.search-section {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #fafbfc;
}

.search-container {
  position: relative;
  max-width: 500px;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.125rem;
  color: #95a5a6;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.btn-clear {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: #e74c3c;
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-clear:hover {
  background: #c0392b;
  transform: translateY(-50%) scale(1.1);
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-count {
  color: #7f8c8d;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Alertas */
.alert {
  padding: 1rem 1.5rem;
  margin: 1.5rem;
  border-radius: 8px;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.alert-danger {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
}

.alert-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.alert-content strong {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.alert-content ul {
  margin: 0;
  padding-left: 1.25rem;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top-color: #3498db;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Tabla */
.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.table-row {
  transition: background 0.2s;
}

.table-row:hover {
  background: #f8f9fa;
}

.th-id { width: 80px; }
.th-nombre { min-width: 200px; }
.th-nit { width: 150px; }
.th-email { min-width: 200px; }
.th-telefono { width: 140px; }
.th-estado { width: 120px; }
.th-acciones { width: 120px; text-align: center; }

.badge {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}

.badge-id {
  background: #e3f2fd;
  color: #1976d2;
}

.badge-success {
  background: #d4edda;
  color: #155724;
}

.badge-danger {
  background: #f8d7da;
  color: #721c24;
}

.badge-warning {
  background: #fff3cd;
  color: #856404;
}

.badge-secondary {
  background: #e9ecef;
  color: #6c757d;
}

.nombre-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nombre-text {
  font-weight: 600;
  color: #2c3e50;
}

.nit-text {
  font-family: 'Courier New', monospace;
  color: #555;
  font-size: 0.9rem;
}

.email-link {
  color: #3498db;
  text-decoration: none;
  transition: color 0.2s;
}

.email-link:hover {
  color: #2980b9;
  text-decoration: underline;
}

.telefono-text {
  color: #555;
  font-size: 0.9rem;
}

.text-muted {
  color: #adb5bd;
}

.actions-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-icon {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
}

.btn-edit {
  background: #fff3cd;
  color: #856404;
}

.btn-edit:hover {
  background: #f39c12;
  color: white;
  transform: translateY(-2px);
}

.btn-view {
  background: #d1ecf1;
  color: #0c5460;
}

.btn-view:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #7f8c8d;
  margin: 0 0 1.5rem 0;
}

/* Botones */
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
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #e9ecef;
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  color: #2c3e50;
  font-size: 1.125rem;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  color: #2c3e50;
  font-size: 1rem;
}

.detail-link {
  color: #3498db;
  text-decoration: none;
}

.detail-link:hover {
  text-decoration: underline;
}

.notas-text {
  color: #555;
  line-height: 1.6;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin: 0;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  background: #f8f9fa;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active {
  transition: all 0.3s;
}

.modal-leave-active {
  transition: all 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 1024px) {
  .table {
    font-size: 0.875rem;
  }

  .table th,
  .table td {
    padding: 0.75rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-container {
    max-width: 100%;
  }

  .table-container {
    overflow-x: scroll;
  }

  .table {
    min-width: 900px;
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