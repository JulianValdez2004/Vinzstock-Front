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
        <button class="btn btn-secondary" @click="irACrearPedido">
          <span class="icon">➕</span>
          Nuevo Pedido
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
              {{ hayProveedores ? `${proveedoresFiltrados.length} proveedor${proveedoresFiltrados.length !== 1 ? 'es' : ''}` : 'Sin resultados' }}
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
                v-for="prov in proveedoresFiltrados"
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/apiLogin';

const router = useRouter();

// Estado reactivo
const proveedores = ref([]);
const terminoBusqueda = ref('');
const cargando = ref(false);
const errores = ref([]);
const mostrarModal = ref(false);
const proveedorSeleccionado = ref(null);

// Computed
const proveedoresFiltrados = computed(() => {
  if (!terminoBusqueda.value) {
    return proveedores.value;
  }

  const termino = terminoBusqueda.value.toLowerCase().trim();

  return proveedores.value.filter(prov =>
      prov.nombre.toLowerCase().includes(termino) ||
      prov.nitFiscal.toLowerCase().includes(termino) ||
      prov.email.toLowerCase().includes(termino)
  );
});

const hayProveedores = computed(() => {
  return proveedoresFiltrados.value.length > 0;
});

// Métodos
const cargarProveedores = async () => {
  try {
    cargando.value = true;
    errores.value = [];

    const response = await api.get('/proveedores/all');
    proveedores.value = response.data || [];

  } catch (error) {
    console.error('Error al cargar proveedores:', error);
    errores.value = ['Error al cargar los proveedores. Por favor, intenta de nuevo.'];
  } finally {
    cargando.value = false;
  }
};

const handleBuscar = () => {
  // La búsqueda es reactiva gracias al computed
  // Este método está para posibles acciones futuras
};

const limpiarBusqueda = () => {
  terminoBusqueda.value = '';
};

const irACrear = () => {
  router.push('/admin/proveedores/CrearProveedor');
};

const irACrearPedido = () => {
  router.push('/admin/proveedores/HacerPedido');
};

const editarProveedor = (proveedor) => {
  router.push(`/admin/proveedores/editar/${proveedor.idProveedor}`);
};

const verDetalles = (proveedor) => {
  proveedorSeleccionado.value = proveedor;
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
  setTimeout(() => {
    proveedorSeleccionado.value = null;
  }, 300);
};

const editarDesdeModal = () => {
  if (proveedorSeleccionado.value) {
    cerrarModal();
    editarProveedor(proveedorSeleccionado.value);
  }
};

// Utilidades de formato
const formatTelefono = (telefono) => {
  if (!telefono) return '-';
  // Formato: (300) 123-4567
  if (telefono.length === 10) {
    return `(${telefono.substring(0, 3)}) ${telefono.substring(3, 6)}-${telefono.substring(6)}`;
  }
  return telefono;
};

const formatFecha = (fecha) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatMonto = (monto) => {
  if (monto === null || monto === undefined) return '0';
  return new Intl.NumberFormat('es-CO').format(monto);
};

const getEstadoClass = (estado) => {
  const estadoNormalizado = (estado || 'ACTIVO').toUpperCase();

  return {
    'badge-activo': estadoNormalizado === 'ACTIVO',
    'badge-inactivo': estadoNormalizado === 'INACTIVO',
    'badge-suspendido': estadoNormalizado === 'SUSPENDIDO'
  };
};

// Lifecycle
onMounted(() => {
  cargarProveedores();
});
</script>

<style scoped>
.proveedores-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

/* Alert */
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
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

.alert-content strong {
  display: block;
  margin-bottom: 0.25rem;
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
  width: 60px;
  height: 60px;
  border: 4px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Table */
.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s;
}

.table tbody tr:hover {
  background: #f8f9fa;
}

.table td {
  padding: 1rem;
  vertical-align: middle;
}

/* Column widths */
.th-id, .td-id { width: 80px; text-align: center; }
.th-nombre, .td-nombre { min-width: 200px; }
.th-nit, .td-nit { width: 150px; }
.th-email, .td-email { min-width: 200px; }
.th-telefono, .td-telefono { width: 140px; }
.th-estado, .td-estado { width: 120px; text-align: center; }
.th-acciones, .td-acciones { width: 120px; text-align: center; }

/* Badges */
.badge {
  display: inline-block;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-id {
  background: #e3f2fd;
  color: #1976d2;
}

.badge-activo {
  background: #d4edda;
  color: #155724;
}

.badge-inactivo {
  background: #f8d7da;
  color: #721c24;
}

.badge-suspendido {
  background: #fff3cd;
  color: #856404;
}

/* Table cells */
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
}

.email-link {
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

.email-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.telefono-text {
  font-family: 'Courier New', monospace;
  color: #555;
}

.text-muted {
  color: #95a5a6;
}

/* Actions */
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
  background: #e3f2fd;
  color: #1976d2;
}

.btn-edit:hover {
  background: #bbdefb;
  transform: translateY(-2px);
}

.btn-view {
  background: #f3e5f5;
  color: #7b1fa2;
}

.btn-view:hover {
  background: #e1bee7;
  transform: translateY(-2px);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
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
  max-width: 700px;
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
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

.detail-link {
  color: #667eea;
  text-decoration: none;
}

.detail-link:hover {
  text-decoration: underline;
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
  .proveedores-page {
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

  .table-container {
    font-size: 0.875rem;
  }

  .table th,
  .table td {
    padding: 0.75rem 0.5rem;
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