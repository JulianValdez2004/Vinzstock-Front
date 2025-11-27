<template>
  <div class="inventariodos-view">
    <!-- Header con botones de acción -->
    <div class="header-section">
      <div class="header-left">
        <h2>Gestión de Inventario</h2>
        <p class="subtitle">{{ productos.length }} productos registrados</p>
      </div>
      <div class="header-right">
        <router-link to="/admin/inventario/crearProducto" class="btn-primary">
          ➕ Crear Producto
        </router-link>
      </div>
    </div>

    <!-- Formulario de creación (modal/overlay) -->
    <div v-if="showCrearProducto" class="modal-overlay" @click.self="closeCrearProducto">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Crear Nuevo Producto</h3>
          <button @click="closeCrearProducto" class="btn-close">✕</button>
        </div>
        <CrearProductoView
            @productoCreado="handleProductoCreado"
            @cancelar="closeCrearProducto"
        />
      </div>
    </div>

    <!-- Formulario de edición (modal/overlay) -->
    <div v-if="showEditarProducto" class="modal-overlay" @click.self="closeEditarProducto">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Editar Producto</h3>
          <button @click="closeEditarProducto" class="btn-close">✕</button>
        </div>
        <EditarProductoView
            :producto="productoSeleccionado"
            @productoActualizado="handleProductoActualizado"
            @cancelar="closeEditarProducto"
        />
      </div>
    </div>

    <!-- Buscador y filtros -->
    <div class="search-section">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar producto por nombre o descripción..."
            class="search-input"
        />
        <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="clear-btn"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Tabla de productos -->
    <div class="table-container">
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Cargando productos...</p>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
        <button @click="loadProductos" class="btn-retry">Reintentar</button>
      </div>

      <div v-else-if="filteredProductos.length === 0" class="empty-state">
        <span class="empty-icon">📦</span>
        <h3>No hay productos</h3>
        <p v-if="searchQuery">No se encontraron productos con "{{ searchQuery }}"</p>
        <p v-else>Comienza creando tu primer producto</p>

      </div>

      <table v-else class="productos-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio (sin IVA)</th>
          <th>IVA</th>
          <th>Precio Final</th>
          <th>Cantidad</th>
          <th>Acciones</th>

        </tr>
        </thead>
        <tbody>
        <tr v-for="producto in filteredProductos" :key="producto.idProducto">
          <td>{{ producto.idProducto }}</td>
          <td class="producto-nombre">{{ producto.nombre }}</td>
          <td class="producto-descripcion">{{ producto.descripcion }}</td>
          <td class="precio">${{ Number(producto.precioVenta).toLocaleString('es-CO') }}</td>
          <td class="iva-badge">{{ producto.iva }}%</td>
          <td class="precio-final">
            {{ formatPrecioFinal(producto.precioVenta, producto.iva) }}
          </td>
          <td></td>
          <td>
            <div class="actions">
              <button
                  @click="editarProducto(producto)"
                  class="btn-edit"
                  title="Editar"
              >
                ✏️
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import productoService from '@/services/ProductoService'
import CrearProductoView from './CrearProductoView.vue'
import EditarProductoView from './EditarProductoView.vue'

const productos = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const error = ref('')

const showCrearProducto = ref(false)
const showEditarProducto = ref(false)
const productoSeleccionado = ref(null)

// Productos filtrados por búsqueda
const filteredProductos = computed(() => {
  if (!searchQuery.value) return productos.value

  const query = searchQuery.value.toLowerCase()
  return productos.value.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.descripcion.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  await loadProductos()
})

/**
 * Cargar todos los productos
 */
async function loadProductos() {
  isLoading.value = true
  error.value = ''

  try {
    const result = await productoService.getAllProductos()
    if (result.success) {
      productos.value = result.data
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Error al cargar productos'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

/**
 * Formatear precio final con IVA
 */
function formatPrecioFinal(precio, iva) {
  const precioConIva = Number(precio) + (Number(precio) * Number(iva) / 100)
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(precioConIva)
}

/**
 * Abrir formulario de edición
 */
function editarProducto(producto) {
  productoSeleccionado.value = { ...producto }
  showEditarProducto.value = true
}

/**
 * Confirmar eliminación
 */
/*
async function confirmarEliminar(producto) {
  if (confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
    try {
      const result = await productoService.deleteProducto(producto.idProducto)
      if (result.success) {
        alert('Producto eliminado exitosamente')
        await loadProductos()
      } else {
        alert(result.error)
      }
    } catch (err) {
      alert('Error al eliminar producto')
      console.error(err)
    }
  }
}
*/
/**
 * Manejar creación exitosa
 */
function handleProductoCreado(producto) {
  console.log('Producto creado:', producto)
  closeCrearProducto()
  loadProductos()
}

/**
 * Manejar actualización exitosa
 */
function handleProductoActualizado(producto) {
  console.log('Producto actualizado:', producto)
  closeEditarProducto()
  loadProductos()
}

/**
 * Cerrar modal de crear
 */
function closeCrearProducto() {
  showCrearProducto.value = false
}

/**
 * Cerrar modal de editar
 */
function closeEditarProducto() {
  showEditarProducto.value = false
  productoSeleccionado.value = null
}
</script>

<style scoped>
.inventario-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left h2 {
  margin: 0 0 4px 0;
  font-size: 24px;
  color: #0f172a;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.btn-crear {
  padding: 10px 20px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-crear:hover {
  background: #15803d;
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
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #0f172a;
  font-weight: 600;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f1f5f9;
  color: #0f172a;
}

/* Buscador */
.search-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  font-size: 18px;
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 12px 48px 12px 48px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-btn {
  position: absolute;
  right: 12px;
  background: #f1f5f9;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* Tabla */
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  overflow: hidden;
}

.loading {
  padding: 60px;
  text-align: center;
  color: #64748b;
}



.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f1f5f9;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  padding: 40px;
  text-align: center;
  color: #dc2626;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.btn-retry {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-retry:hover {
  background: #2563eb;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #64748b;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  display: block;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #0f172a;
  font-size: 20px;
}

.empty-state p {
  margin: 0 0 24px 0;
  font-size: 14px;
}

.btn-primary {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.productos-table {
  width: 100%;
  border-collapse: collapse;
}

.productos-table thead {
  background: #f8fafc;
}

.productos-table th {
  padding: 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.productos-table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  color: #0f172a;
}

.productos-table tbody tr:hover {
  background: #f8fafc;
}

.producto-nombre {
  font-weight: 600;
  color: #0f172a;
}

.producto-descripcion {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #64748b;
}

.precio {
  font-weight: 600;
  color: #059669;
}

.iva-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.precio-final {
  font-weight: 700;
  font-size: 15px;
  color: #0f172a;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.btn-edit {
  background: #eff6ff;
}

.btn-edit:hover {
  background: #dbeafe;
  transform: scale(1.1);
}

.btn-delete {
  background: #fef2f2;
}

.btn-delete:hover {
  background: #fee2e2;
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    max-width: 100%;
  }

  .productos-table {
    font-size: 12px;
  }

  .productos-table th,
  .productos-table td {
    padding: 12px 8px;
  }

  .producto-descripcion {
    max-width: 150px;
  }
}
</style>