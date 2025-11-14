<template>
  <div class="editar-producto-container">
    <div v-if="viewModel.error.value" class="error-message">
      {{ viewModel.error.value }}
    </div>

    <div v-if="viewModel.successMessage.value" class="success-message">
      {{ viewModel.successMessage.value }}
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- Nombre del producto -->
      <div class="form-group">
        <label for="nombre">Nombre del Producto *</label>
        <input
            id="nombre"
            type="text"
            v-model="viewModel.nombre.value"
            placeholder="Ej: Laptop HP"
            :disabled="viewModel.isLoading.value"
            required
        />
      </div>

      <!-- Descripción -->
      <div class="form-group">
        <label for="descripcion">Descripción *</label>
        <textarea
            id="descripcion"
            v-model="viewModel.descripcion.value"
            placeholder="Describe el producto"
            :disabled="viewModel.isLoading.value"
            rows="4"
            required
        ></textarea>
      </div>

      <div class="form-row">
        <!-- Precio de Venta -->
        <div class="form-group">
          <label for="precioVenta">Precio de Venta (sin IVA) *</label>
          <div class="input-with-prefix">
            <span class="prefix">$</span>
            <input
                id="precioVenta"
                type="number"
                v-model="viewModel.precioVenta.value"
                placeholder="0"
                min="0"
                step="100"
                :disabled="viewModel.isLoading.value"
                required
            />
          </div>
        </div>

        <!-- IVA -->
        <div class="form-group">
          <label for="iva">IVA (%) *</label>
          <input
              id="iva"
              type="number"
              v-model="viewModel.iva.value"
              placeholder="19"
              min="0"
              max="100"
              step="1"
              :disabled="viewModel.isLoading.value"
              required
          />
        </div>
      </div>

      <!-- Resumen de precio -->
      <div class="price-summary">
        <div class="summary-row">
          <span>Precio sin IVA:</span>
          <span class="value">${{ Number(viewModel.precioVenta.value || 0).toLocaleString('es-CO') }}</span>
        </div>
        <div class="summary-row">
          <span>IVA ({{ viewModel.iva.value }}%):</span>
          <span class="value">${{ (Number(viewModel.precioVenta.value || 0) * Number(viewModel.iva.value) / 100).toLocaleString('es-CO') }}</span>
        </div>
        <div class="summary-row total">
          <span>Precio Final:</span>
          <span class="value">{{ viewModel.precioFormateado.value }}</span>
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
            :disabled="viewModel.isLoading.value || !viewModel.isFormValid.value"
        >
          {{ viewModel.isLoading.value ? 'Actualizando...' : 'Actualizar Producto' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { EditarProductoViewModel } from '@/ViewModels/EditarProductoViewModel'

const props = defineProps({
  producto: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['productoActualizado', 'cancelar'])
const viewModel = new EditarProductoViewModel()

onMounted(() => {
  // Cargar datos del producto
  viewModel.loadProducto(props.producto)
})

async function handleSubmit() {
  const result = await viewModel.executeUpdate()

  if (result.success) {
    emit('productoActualizado', result.data)
  }
}

function handleCancel() {
  emit('cancelar')
}
</script>

<style scoped>
.editar-producto-container {
  padding: 24px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #e6edf3;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06);
}

.input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}

.prefix {
  position: absolute;
  left: 12px;
  color: #64748b;
  font-weight: 600;
  font-size: 14px;
  pointer-events: none;
}

.input-with-prefix input {
  padding-left: 28px;
}

.price-summary {
  background: #f8fafc;
  padding: 16px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #475569;
}

.summary-row.total {
  padding-top: 8px;
  border-top: 2px solid #e2e8f0;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.summary-row .value {
  font-weight: 600;
  color: #0f172a;
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
  padding: 10px 24px;
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
</style>