<template>
  <div class="crear-producto-container">
    <div class="crear-producto-card">
      <h2>Crear Nuevo Producto</h2>
      <p class="subtitle">Completa la información del producto</p>

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
          <div class="input-with-validation">
            <input
                id="nombre"
                type="text"
                v-model="viewModel.nombre.value"
                placeholder="Ej: Yogurt Griego"
                :disabled="viewModel.isLoading.value"
                :class="{ 'error-input': viewModel.nombreError.value }"
                required
            />
            <span v-if="viewModel.isCheckingNombre.value" class="checking">⏳</span>
            <span v-else-if="viewModel.nombreError.value" class="error-icon">❌</span>
            <span v-else-if="viewModel.nombre.value.length >= 3" class="success-icon">✅</span>
          </div>
          <span v-if="viewModel.nombreError.value" class="error-hint">
            {{ viewModel.nombreError.value }}
          </span>
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label for="descripcion">Descripción *</label>
          <textarea
              id="descripcion"
              v-model="viewModel.descripcion.value"
              placeholder="Describe el producto (mínimo 10 caracteres)"
              :disabled="viewModel.isLoading.value"
              rows="4"

          ></textarea>
          <span class="char-count">
            {{ viewModel.descripcion.value.length }} caracteres
          </span>
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
            {{ viewModel.isLoading.value ? 'Creando...' : 'Crear Producto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { CrearProductoViewModel } from '@/ViewModels/CrearProductoViewModel'
import {useRouter} from "vue-router";

const emit = defineEmits(['productoCreado', 'cancelar'])
const viewModel = new CrearProductoViewModel()
const router = useRouter()

async function handleSubmit() {
  const result = await viewModel.executeCreate()

  if (result.success) {
    emit('productoCreado', result.data)
  }
}

function handleCancel() {
  if (confirm('¿Estás seguro de cancelar? Se perderán los datos ingresados.')) {
    viewModel.clearForm()
    router.push('/admin/inventario')


  }
}
</script>

<style scoped>
.crear-producto-container {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.crear-producto-card {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.crear-producto-card h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #0f172a;
  font-weight: 600;
}

.subtitle {
  margin: 0 0 24px 0;
  color: #64748b;
  font-size: 14px;
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

.form-group input:disabled,
.form-group textarea:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.6;
}

.input-with-validation {
  position: relative;
}

.input-with-validation input {
  padding-right: 35px;
}

.checking,
.error-icon,
.success-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
}

.checking {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: translateY(-50%) rotate(0deg); }
  to { transform: translateY(-50%) rotate(360deg); }
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

.char-count {
  font-size: 12px;
  color: #64748b;
  text-align: right;
}

.error-input {
  border-color: #dc2626 !important;
}

.error-hint {
  font-size: 12px;
  color: #dc2626;
  margin-top: 4px;
  display: block;
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
  animation: slideIn 0.3s ease-out;
}

.success-message {
  padding: 12px 16px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #bbf7d0;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>