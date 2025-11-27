<template>
  <div class="crear-compra-container">
    <div class="crear-compra-card">
      <div class="card-header">
        <h2>Registrar Compra</h2>
        <p class="subtitle">Selecciona proveedor y productos</p>
      </div>

      <!-- Mensaje de error -->
      <transition name="fade">
        <div v-if="viewModel.error.value" class="alert alert-error">
          <span class="alert-icon">⚠️</span>
          <span>{{ viewModel.error.value }}</span>
          <button class="btn-close-alert" @click="viewModel.clearMessages()">✕</button>
        </div>
      </transition>

      <!-- Mensaje de éxito -->
      <transition name="fade">
        <div v-if="viewModel.successMessage.value" class="alert alert-success">
          <span class="alert-icon">✅</span>
          <span>{{ viewModel.successMessage.value }}</span>
        </div>
      </transition>

      <form @submit.prevent="handleSubmit" class="form">
        <!-- Selección de Proveedor -->
        <div class="form-section">
          <h3 class="section-title">1. Seleccionar Proveedor</h3>

          <div class="form-group">
            <label for="proveedor">Proveedor <span class="required">*</span></label>
            <select
                id="proveedor"
                v-model="viewModel.idProveedor.value"
                @change="viewModel.loadProductosByProveedor(viewModel.idProveedor.value)"
                :disabled="viewModel.isLoading.value"
                class="form-select"
                required
            >
              <option disabled value="">-- Seleccione un proveedor --</option>
              <option
                  v-for="prov in viewModel.proveedores.value"
                  :key="prov.idProveedor"
                  :value="prov.idProveedor"
              >
                {{ prov.nombre }} (NIT: {{ prov.nitFiscal }})
              </option>
            </select>
          </div>
        </div>

        <!-- Estado de carga de productos -->
        <transition name="fade">
          <div v-if="viewModel.loadingProductos.value" class="loading-productos">
            <div class="spinner"></div>
            <span>Cargando productos del proveedor...</span>
          </div>
        </transition>

        <!-- Mensaje cuando no hay productos -->
        <transition name="fade">
          <div
              v-if="!viewModel.loadingProductos.value && viewModel.idProveedor.value && viewModel.productos.value.length === 0"
              class="alert alert-warning"
          >
            <span class="alert-icon">📦</span>
            <span>Este proveedor no tiene productos asociados</span>
          </div>
        </transition>

        <!-- Sección de Productos -->
        <div class="form-section" v-if="viewModel.productos.value.length > 0">
          <h3 class="section-title">
            2. Agregar Productos
            <span class="badge">{{ viewModel.productos.value.length }} disponibles</span>
          </h3>

          <!-- Lista de detalles -->
          <div class="detalles-container">
            <div
                v-for="(detalle, index) in viewModel.detalles.value"
                :key="index"
                class="detalle-row"
            >
              <div class="detalle-number">{{ index + 1 }}</div>

              <!-- Producto -->
              <div class="form-group producto-select">
                <label>Producto</label>
                <select
                    v-model="detalle.idProducto"
                    @change="onProductoChange(index)"
                    class="form-select"
                    :class="{ 'is-invalid': !detalle.idProducto && submitted }"
                    required
                >
                  <option disabled value="">Seleccionar producto</option>
                  <option
                      v-for="prod in viewModel.productos.value"
                      :key="prod.idProducto"
                      :value="prod.idProducto"
                  >
                    {{ prod.nombre }} - Stock: {{ prod.stock || 0 }}
                  </option>
                </select>
              </div>

              <!-- Cantidad -->
              <div class="form-group cantidad-input">
                <label>Cantidad</label>
                <input
                    type="number"
                    v-model.number="detalle.cantidad"
                    min="1"
                    class="form-input"
                    :class="{ 'is-invalid': detalle.cantidad <= 0 && submitted }"
                    placeholder="Cant."
                    required
                />
              </div>

              <!-- Precio Unitario -->
              <div class="form-group precio-input">
                <label>Precio Unit.</label>
                <input
                    type="number"
                    v-model.number="detalle.precioUnitario"
                    min="0"
                    class="form-input"
                    :class="{ 'is-invalid': detalle.precioUnitario <= 0 && submitted }"
                    placeholder="$ 0"
                    required
                />
              </div>

              <!-- Subtotal -->
              <div class="subtotal-display">
                <label>Subtotal</label>
                <span class="subtotal-value">
                  {{ formatCurrency(detalle.cantidad * detalle.precioUnitario) }}
                </span>
              </div>

              <!-- Eliminar -->
              <button
                  type="button"
                  class="btn-remove"
                  @click="viewModel.eliminarDetalle(index)"
                  v-if="viewModel.detalles.value.length > 1"
                  title="Eliminar producto"
              >
                🗑️
              </button>
            </div>
          </div>

          <!-- Botón agregar producto -->
          <button
              type="button"
              class="btn-add-product"
              @click="viewModel.agregarDetalle()"
          >
            <span class="icon">➕</span>
            Agregar otro producto
          </button>
        </div>

        <!-- Resumen de la compra -->
        <div class="form-section resumen" v-if="viewModel.productos.value.length > 0">
          <h3 class="section-title">3. Resumen de Compra</h3>

          <div class="resumen-card">
            <div class="resumen-row">
              <span>Proveedor:</span>
              <span class="value">{{ getProveedorNombre() }}</span>
            </div>
            <div class="resumen-row">
              <span>Productos:</span>
              <span class="value">{{ getProductosCount() }} item(s)</span>
            </div>
            <div class="resumen-row total">
              <span>TOTAL:</span>
              <span class="value total-value">{{ viewModel.totalFormateado.value }}</span>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="form-actions">
          <button
              type="button"
              class="btn btn-secondary"
              @click="handleCancel"
              :disabled="viewModel.isLoading.value"
          >
            Cancelar
          </button>
          <button
              type="submit"
              class="btn btn-primary"
              :disabled="viewModel.isLoading.value || viewModel.productos.value.length === 0"
          >
            <span v-if="viewModel.isLoading.value" class="spinner-btn"></span>
            {{ viewModel.isLoading.value ? 'Registrando...' : 'Registrar Compra' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CrearCompraViewModel } from '@/ViewModels/CrearCompraViewModel'

const router = useRouter()
const viewModel = new CrearCompraViewModel()
const submitted = ref(false)

// Cuando cambia el proveedor, cargar sus productos
async function onProveedorChange() {
  const idProveedor = viewModel.idProveedor.value
  console.log('🔄 Proveedor seleccionado:', idProveedor)

  if (idProveedor) {
    await viewModel.loadProductosByProveedor(idProveedor)
  } else {
    viewModel.productos.value = []
  }
}

// Cuando cambia el producto, actualizar precio sugerido
function onProductoChange(index) {
  viewModel.onProductoChange(index)
}

// Formatear moneda
function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value || 0)
}

// Obtener nombre del proveedor seleccionado
function getProveedorNombre() {
  const prov = viewModel.proveedores.value.find(
      p => p.idProveedor == viewModel.idProveedor.value
  )
  return prov ? prov.nombre : 'No seleccionado'
}

// Contar productos válidos
function getProductosCount() {
  return viewModel.detalles.value.filter(d => d.idProducto && d.cantidad > 0).length
}

// Enviar formulario
async function handleSubmit() {
  submitted.value = true
  const result = await viewModel.executeCreate()

  if (result.success) {
    setTimeout(() => {
      router.push('/admin/proveedores')
    }, 2000)
  }
}

// Cancelar
function handleCancel() {
  if (confirm('¿Estás seguro de cancelar? Se perderán los datos ingresados.')) {
    viewModel.clearForm()
    router.push('/admin/proveedores')
  }
}
</script>

<style scoped>


.crear-compra-card {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
}

.card-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
}

.subtitle {
  margin: 0;
  opacity: 0.9;
}

.form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  color: #2c3e50;
  font-size: 1.125rem;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
}

.required {
  color: #e74c3c;
}

.form-select,
.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-select:disabled,
.form-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.is-invalid {
  border-color: #e74c3c !important;
}

/* Alertas */
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  margin: 1rem 2rem;
  border-radius: 8px;
}

.alert-error {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
}

.alert-success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.alert-warning {
  background: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
}

.alert-icon {
  font-size: 1.25rem;
}

.btn-close-alert {
  margin-left: auto;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.6;
}

.btn-close-alert:hover {
  opacity: 1;
}

/* Loading */
.loading-productos {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #667eea;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Detalles */
.detalles-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detalle-row {
  display: grid;
  grid-template-columns: 40px 2fr 100px 120px 120px 40px;
  gap: 1rem;
  align-items: end;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.detalle-number {
  width: 32px;
  height: 32px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.producto-select {
  margin-bottom: 0;
}

.cantidad-input,
.precio-input {
  margin-bottom: 0;
}

.subtotal-display {
  text-align: right;
}

.subtotal-display label {
  display: block;
  font-size: 0.75rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
}

.subtotal-value {
  font-weight: 700;
  color: #27ae60;
  font-size: 1rem;
}

.btn-remove {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #e74c3c;
  border-color: #c0392b;
}

.btn-add-product {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  background: white;
  border: 2px dashed #667eea;
  border-radius: 8px;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-product:hover {
  background: #f0f4ff;
}

/* Resumen */
.resumen-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.resumen-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.resumen-row:last-child {
  border-bottom: none;
}

.resumen-row .value {
  font-weight: 600;
  color: #2c3e50;
}

.resumen-row.total {
  font-size: 1.25rem;
  padding-top: 1rem;
  border-top: 2px solid #667eea;
  margin-top: 0.5rem;
}

.total-value {
  color: #27ae60 !important;
}

/* Botones */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #7f8c8d;
}

.spinner-btn {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
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

/* Responsive */
@media (max-width: 768px) {
  .crear-compra-container {
    padding: 1rem;
  }

  .detalle-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .detalle-number {
    display: none;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>