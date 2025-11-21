<template>
  <div class="crear-compra-container">
    <div class="crear-compra-card">
      <h2>Registrar Compra</h2>
      <p class="subtitle">Selecciona proveedor y productos</p>

      <div v-if="viewModel.error.value" class="error-message">
        {{ viewModel.error.value }}
      </div>

      <div v-if="viewModel.successMessage.value" class="success-message">
        {{ viewModel.successMessage.value }}
      </div>

      <!-- 🐛 DEBUG: Mostrar info del proveedor seleccionado -->
      <div v-if="viewModel.idProveedor.value" class="debug-info">
        🔍 Debug: Proveedor ID = {{ viewModel.idProveedor.value }}
        <br>
        📊 Productos cargados: {{ viewModel.productos.value.length }}
      </div>

      <form @submit.prevent="handleSubmit" class="form">
        <!-- Proveedor -->
        <div class="form-group">
          <label for="proveedor">Proveedor *</label>
          <select
              id="proveedor"
              v-model="viewModel.idProveedor.value"
              @change="onProveedorChange"
              :disabled="viewModel.isLoading.value"
              required
          >
            <option disabled value="">Seleccione un proveedor</option>
            <option
                v-for="prov in viewModel.proveedores.value"
                :key="prov.idProveedor"
                :value="prov.idProveedor"
            >
              {{ prov.nombre }} (ID: {{ prov.idProveedor }})
            </option>
          </select>
        </div>

        <!-- Mensaje de carga de productos -->
        <div v-if="loadingProductos" class="info-message">
          🔄 Cargando productos del proveedor {{ viewModel.idProveedor.value }}...
        </div>

        <!-- Mensaje cuando no hay productos -->
        <div v-if="!loadingProductos && viewModel.idProveedor.value && viewModel.productos.value.length === 0" class="warning-message">
          ⚠️ Este proveedor no tiene productos asociados (o no se pudieron cargar)
        </div>

        <!-- Detalles de productos -->
        <div
            v-for="(detalle, index) in viewModel.detalles.value"
            :key="index"
            class="detalle-row"
        >
          <!-- Producto -->
          <div class="form-field">
            <select
                v-model="detalle.idProducto"
                :class="{ 'error-input': !detalle.idProducto }"
                :disabled="viewModel.productos.value.length === 0"
                required
            >
              <option disabled value="">Selecciona un producto</option>
              <option
                  v-for="prod in viewModel.productos.value"
                  :key="prod.idProducto"
                  :value="prod.idProducto"
              >
                {{ prod.nombre }} - ${{ prod.precioVenta }}
              </option>
            </select>
            <span v-if="!detalle.idProducto && viewModel.productos.value.length > 0" class="error-hint">
              Selecciona un producto
            </span>
          </div>

          <!-- Cantidad -->
          <div class="form-field">
            <input
                type="number"
                v-model.number="detalle.cantidad"
                min="1"
                placeholder="Cantidad"
                :class="{ 'error-input': detalle.cantidad <= 0 }"
                required
            />
            <span v-if="detalle.cantidad <= 0" class="error-hint">
              Cantidad debe ser mayor a 0
            </span>
          </div>

          <!-- Precio Unitario -->
          <div class="form-field">
            <input
                type="number"
                v-model.number="detalle.precioUnitario"
                min="0"
                placeholder="Precio unitario"
                :class="{ 'error-input': detalle.precioUnitario <= 0 }"
                required
            />
            <span v-if="detalle.precioUnitario <= 0" class="error-hint">
              Precio debe ser mayor a 0
            </span>
          </div>

          <!-- Subtotal -->
          <span class="subtotal">
            Subtotal:
            {{
              (detalle.cantidad * detalle.precioUnitario).toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP'
              })
            }}
          </span>

          <!-- Eliminar -->
          <button
              type="button"
              class="btn-delete"
              @click="viewModel.eliminarDetalle(index)"
              v-if="viewModel.detalles.value.length > 1"
              title="Eliminar producto"
          >
            ❌
          </button>
        </div>

        <button
            type="button"
            class="btn-add-product"
            @click="viewModel.agregarDetalle"
            :disabled="viewModel.productos.value.length === 0"
        >
          ➕ Agregar producto
        </button>

        <!-- Total -->
        <div class="price-summary">
          <div class="summary-row total">
            <span>Total de la compra:</span>
            <span class="value">{{ viewModel.totalFormateado.value }}</span>
          </div>
        </div>

        <!-- Botones -->
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
            {{ viewModel.isLoading.value ? 'Registrando...' : 'Registrar Compra' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CrearCompraViewModel } from '@/ViewModels/CrearCompraViewModel'
import { useRouter } from 'vue-router'

const viewModel = new CrearCompraViewModel()
const router = useRouter()
const loadingProductos = ref(false)

// ⭐ FUNCIÓN MEJORADA CON MÁS LOGS
async function onProveedorChange() {
  const idProveedor = viewModel.idProveedor.value

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔔 onProveedorChange llamado')
  console.log('📌 ID Proveedor seleccionado:', idProveedor)
  console.log('📌 Tipo de dato:', typeof idProveedor)

  if (!idProveedor) {
    console.log('⚠️ No hay proveedor seleccionado, limpiando productos')
    viewModel.productos.value = []
    return
  }

  try {
    loadingProductos.value = true
    viewModel.error.value = ''

    // Construir la URL
    const url = `http://localhost:8080/api/compras/productos-proveedor/${idProveedor}`
    console.log('📡 Llamando a:', url)

    // Hacer la petición
    console.log('⏳ Haciendo fetch...')
    const response = await fetch(url)

    console.log('📥 Respuesta recibida')
    console.log('📊 Status:', response.status)
    console.log('📊 Status Text:', response.statusText)
    console.log('📊 OK:', response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error HTTP:', errorText)
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('📦 Resultado completo:', result)
    console.log('✅ Success:', result.success)
    console.log('📊 Data:', result.data)
    console.log('🔢 Total:', result.total)

    if (result.success) {
      viewModel.productos.value = result.data
      console.log(`✅ Productos cargados exitosamente: ${result.total}`)

      // Limpiar detalles cuando cambia el proveedor
      viewModel.detalles.value = [{
        idProducto: '',
        cantidad: 1,
        precioUnitario: 0
      }]

      if (result.data && result.data.length > 0) {
        console.log('📋 Primer producto:', result.data[0])
      }
    } else {
      console.error('❌ Error en la respuesta:', result.message)
      viewModel.error.value = result.message || 'Error al cargar productos'
      viewModel.productos.value = []
    }

  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('❌❌❌ ERROR CAPTURADO ❌❌❌')
    console.error('Tipo:', error.constructor.name)
    console.error('Mensaje:', error.message)
    console.error('Stack:', error.stack)
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    viewModel.error.value = `Error: ${error.message}`
    viewModel.productos.value = []
  } finally {
    loadingProductos.value = false
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  }
}

async function handleSubmit() {
  const result = await viewModel.executeCreate()
  if (result.success) {
    router.push('/admin/compras')
  }
}

function handleCancel() {
  if (confirm('¿Cancelar la compra?')) {
    viewModel.clearForm()
    router.push('/admin/compras')
  }
}
</script>

<style scoped>
.crear-compra-container {
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.crear-compra-card {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

h2 {
  margin: 0 0 8px 0;
  color: #0f172a;
  font-size: 24px;
  font-weight: 600;
}

.subtitle {
  margin-bottom: 24px;
  color: #64748b;
  font-size: 14px;
}

.debug-info {
  padding: 12px 16px;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid #c7d2fe;
  margin-bottom: 16px;
  font-family: monospace;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
}

.detalle-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto auto;
  gap: 12px;
  align-items: start;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media (max-width: 768px) {
  .detalle-row {
    grid-template-columns: 1fr;
  }
}

input,
select {
  padding: 10px 12px;
  border: 1px solid #e6edf3;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  background: #fff;
}

input:focus,
select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06);
}

input:disabled,
select:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.6;
}

.error-input {
  border-color: #dc2626 !important;
}

.error-hint {
  font-size: 12px;
  color: #dc2626;
  margin-top: 2px;
}

.subtotal {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
  white-space: nowrap;
}

.btn-delete {
  padding: 8px 12px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
}

.btn-delete:hover {
  background: #fecaca;
}

.btn-add-product {
  padding: 12px 20px;
  border: 2px dashed #cbd5e1;
  background: #fff;
  color: #475569;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  width: 100%;
}

.btn-add-product:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #f0f9ff;
}

.btn-add-product:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.price-summary {
  margin-top: 20px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e6edf3;
}

.summary-row.total {
  font-weight: 600;
  font-size: 18px;
  color: #0f172a;
  display: flex;
  justify-content: space-between;
}

.summary-row.total .value {
  color: #2563eb;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
  padding-top: 20px;
  border-top: 1px solid #e6edf3;
}

.btn {
  padding: 12px 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #1e40af;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 12px 16px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #fecaca;
  margin-bottom: 16px;
}

.success-message {
  padding: 12px 16px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #bbf7d0;
  margin-bottom: 16px;
}

.info-message {
  padding: 12px 16px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #bfdbfe;
  margin-bottom: 16px;
}

.warning-message {
  padding: 12px 16px;
  background: #fef3c7;
  color: #d97706;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #fde68a;
  margin-bottom: 16px;
}
</style>