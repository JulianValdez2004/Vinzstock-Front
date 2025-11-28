<template>
  <div class="crear-cliente-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <button class="btn-back" @click="volver" :disabled="viewModel.isLoading.value">
            <span class="icon-back">←</span>
            Volver
          </button>
          <h1>Crear Nuevo Cliente</h1>
        </div>
      </div>

      <!-- Card principal -->
      <div class="card-form">
        <!-- Mensaje de éxito -->
        <transition name="fade">
          <div v-if="viewModel.successMessage.value" class="alert alert-success">
            <div class="alert-icon">✓</div>
            <div class="alert-content">
              <strong>¡Éxito!</strong>
              <p>{{ viewModel.successMessage.value }}</p>
            </div>
          </div>
        </transition>

        <!-- Mensajes de error -->
        <transition name="fade">
          <div v-if="viewModel.error.value" class="alert alert-danger">
            <div class="alert-icon">⚠</div>
            <div class="alert-content">
              <strong>Error</strong>
              <p>{{ viewModel.error.value }}</p>
            </div>
          </div>
        </transition>

        <!-- Formulario -->
        <form @submit.prevent="handleCrear" class="form-create">
          <div class="form-section">
            <h3 class="section-title">Información del Cliente</h3>

            <div class="form-row">
              <!-- Nombre o Razón Social -->
              <div class="form-group full-width">
                <label for="nombre" class="form-label">
                  Nombre o Razón Social
                  <span class="required">*</span>
                </label>
                <input
                    id="nombre"
                    v-model="viewModel.nombreRazonSocial.value"
                    type="text"
                    class="form-input"
                    placeholder="Ej: Juan Pérez o Empresa ABC S.A.S."
                    :disabled="viewModel.isLoading.value"
                    maxlength="100"
                    @input="viewModel.clearMessages()"
                />
                <small class="form-hint">Máximo 100 caracteres, sin caracteres especiales</small>
              </div>
            </div>

            <div class="form-row">
              <!-- Número de Documento -->
              <div class="form-group full-width">
                <label for="numeroDocumento" class="form-label">
                  Número de Documento
                  <span class="required">*</span>
                  <span 
                    v-if="viewModel.tipoDocumentoDetectado.value !== 'DESCONOCIDO'" 
                    class="badge-tipo"
                  >
                    {{ viewModel.tipoDocumentoDetectado.value }}
                  </span>
                </label>
                <input
                    id="numeroDocumento"
                    v-model="viewModel.numeroDocumento.value"
                    type="text"
                    class="form-input"
                    placeholder="CC: 1234567890 o NIT: 123456789-0"
                    :disabled="viewModel.isLoading.value"
                    maxlength="12"
                    @input="handleInputDocumento"
                />
                <small 
                  class="form-hint" 
                  :class="{ 
                    'hint-success': viewModel.tipoDocumentoDetectado.value !== 'DESCONOCIDO' 
                  }"
                >
                  {{ viewModel.getDocumentoHint() }}
                </small>
              </div>
            </div>
          </div>

          <!-- Separador -->
          <div class="form-divider"></div>

          <!-- Acciones -->
          <div class="form-actions">
            <button
                type="button"
                class="btn btn-cancel"
                @click="handleCancelar"
                :disabled="viewModel.isLoading.value"
            >
              Cancelar
            </button>

            <button
                type="button"
                class="btn btn-reset"
                @click="handleLimpiar"
                :disabled="viewModel.isLoading.value"
            >
              Limpiar Formulario
            </button>

            <button
                type="submit"
                class="btn btn-primary"
                :disabled="!viewModel.isFormValid.value || viewModel.isLoading.value"
            >
              <span v-if="viewModel.isLoading.value" class="spinner"></span>
              <span v-else class="icon-save">💾</span>
              {{ viewModel.isLoading.value ? 'Guardando...' : 'Crear Cliente' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Información adicional -->
      <div class="info-card">
        <div class="info-header">
          <span class="info-icon">ℹ️</span>
          <h4>Información Importante</h4>
        </div>
        <ul class="info-list">
          <li>Los campos marcados con <span class="required">*</span> son obligatorios</li>
          <li><strong>Cédula (CC):</strong> Ingrese solo números, entre 6 y 12 dígitos</li>
          <li><strong>NIT:</strong> Formato 123456789-0 (9 dígitos, guión, 1 dígito verificador)</li>
          <li>El número de documento debe ser único en el sistema</li>
          <li>El nombre no puede contener caracteres especiales (@ # $ % &)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CrearClienteViewModel } from '@/ViewModels/CrearClienteViewModel'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const viewModel = new CrearClienteViewModel()
const isAdmin = useAuth().isAdmin;

const handleInputDocumento = () => {
  viewModel.formatearInputDocumento()
  viewModel.clearMessages()
}

const handleCrear = async () => {
  const resultado = await viewModel.executeCreate()

  if (resultado.success) {
    setTimeout(() => {

          router.push('/admin/ventas')
    }, 2500)
  }
}

const handleCancelar = () => {
  if (viewModel.nombreRazonSocial.value || viewModel.numeroDocumento.value) {
    if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los datos ingresados.')) {
      viewModel.clearForm()

        router.push('/admin/ventas')
    }
  } else {

        router.push('/admin/ventas')

  }
}

const handleLimpiar = () => {
  if (confirm('¿Estás seguro de que deseas limpiar el formulario?')) {
    viewModel.clearForm()
  }
}

const volver = () => {
  if (viewModel.nombreRazonSocial.value || viewModel.numeroDocumento.value) {
    if (confirm('¿Estás seguro de que deseas salir? Se perderán los datos ingresados.')) {
      
        router.push('/admin/ventas')

    }
  } else {
    router.push('/admin/ventas')
  }
}

onMounted(() => {
  // Inicialización si es necesaria
})
</script>

<style scoped>


.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-back {
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-back:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px);
}

.btn-back:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-back {
  font-size: 1.25rem;
}

.page-header h1 {
  color: white;
  font-size: 2rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.card-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 2.5rem;
  margin-bottom: 1.5rem;
}

.alert {
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.alert-success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-content strong {
  display: block;
  margin-bottom: 0.5rem;
}

.alert-content p {
  margin: 0;
}

.form-create {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.required {
  color: #e74c3c;
}

.badge-tipo {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.form-input {
  padding: 0.875rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

.form-hint {
  color: #7f8c8d;
  font-size: 0.85rem;
  transition: color 0.3s;
}

.hint-success {
  color: #27ae60;
  font-weight: 500;
}

.form-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 1rem 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
}

.btn {
  padding: 0.875rem 1.75rem;
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-cancel {
  background: #e21c1cea;
  color: white;
}

.btn-cancel:hover:not(:disabled) {
  background: #e21c1cea;
}

.btn-reset {
  background: #e0e0e0;
  color: #2c3e50;
}

.btn-reset:hover:not(:disabled) {
  background: #d0d0d0;
}

.icon-save {
  font-size: 1.25rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.info-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-icon {
  font-size: 1.5rem;
}

.info-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.125rem;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-list li {
  color: #555;
  padding-left: 1.5rem;
  position: relative;
}

.info-list li::before {
  content: "•";
  position: absolute;
  left: 0.5rem;
  color: #667eea;
  font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .crear-cliente-page {
    padding: 1rem 0;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .card-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-back {
    align-self: flex-start;
  }
}
</style>