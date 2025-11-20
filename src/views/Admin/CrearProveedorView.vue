<template>
  <div class="crear-proveedor-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <button class="btn-back" @click="volver" :disabled="cargando">
            <span class="icon-back">←</span>
            Volver
          </button>
          <h1>Crear Nuevo Proveedor</h1>
        </div>
      </div>

      <!-- Card principal -->
      <div class="card-form">
        <!-- Mensaje de éxito -->
        <transition name="fade">
          <div v-if="exitoRegistro" class="alert alert-success">
            <div class="alert-icon">✓</div>
            <div class="alert-content">
              <strong>¡Éxito!</strong>
              <p>{{ mensaje }}</p>
            </div>
          </div>
        </transition>

        <!-- Mensajes de error generales -->
        <transition name="fade">
          <div v-if="errores.length > 0" class="alert alert-danger">
            <div class="alert-icon">⚠</div>
            <div class="alert-content">
              <strong>Errores en el formulario</strong>
              <ul>
                <li v-for="(error, index) in errores" :key="index">{{ error }}</li>
              </ul>
            </div>
          </div>
        </transition>

        <!-- Formulario -->
        <form @submit.prevent="handleCrear" class="form-create">
          <div class="form-section">
            <h3 class="section-title">Información General</h3>

            <div class="form-row">
              <!-- Nombre de la compañía -->
              <div class="form-group">
                <label for="nombre" class="form-label">
                  Nombre de la Compañía
                  <span class="required">*</span>
                </label>
                <input
                    id="nombre"
                    v-model="proveedor.nombre"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': erroresNombre }"
                    placeholder="Ej: Distribuidora XYZ S.A."
                    :disabled="cargando"
                    maxlength="100"
                    @blur="validarCampo('nombre')"
                    @input="limpiarErrorCampo('nombre')"
                />
                <transition name="slide">
                  <span v-if="erroresNombre" class="error-message">
                    {{ erroresNombre }}
                  </span>
                </transition>
                <small class="form-hint">Mínimo 3 caracteres, máximo 100</small>
              </div>

              <!-- NIT Fiscal -->
              <div class="form-group">
                <label for="nitFiscal" class="form-label">
                  NIT Fiscal
                  <span class="required">*</span>
                </label>
                <input
                    id="nitFiscal"
                    v-model="proveedor.nitFiscal"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': erroresNit }"
                    placeholder="Ej: 123456789-0"
                    :disabled="cargando"
                    maxlength="11"
                    @blur="validarCampo('nitFiscal')"
                    @input="limpiarErrorCampo('nitFiscal')"
                />
                <transition name="slide">
                  <span v-if="erroresNit" class="error-message">
                    {{ erroresNit }}
                  </span>
                </transition>
                <small class="form-hint">Formato: 123456789-0 (9 dígitos, guión, 1 dígito)</small>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Información de Contacto</h3>

            <div class="form-row">
              <!-- Email -->
              <div class="form-group">
                <label for="email" class="form-label">
                  Email
                  <span class="required">*</span>
                </label>
                <input
                    id="email"
                    v-model="proveedor.email"
                    type="email"
                    class="form-input"
                    :class="{ 'input-error': erroresEmail }"
                    placeholder="Ej: contacto@empresa.com"
                    :disabled="cargando"
                    @blur="validarCampo('email')"
                    @input="limpiarErrorCampo('email')"
                />
                <transition name="slide">
                  <span v-if="erroresEmail" class="error-message">
                    {{ erroresEmail }}
                  </span>
                </transition>
                <small class="form-hint">Email válido de contacto</small>
              </div>

              <!-- Teléfono -->
              <div class="form-group">
                <label for="telefono" class="form-label">
                  Teléfono
                  <span class="optional">(Opcional)</span>
                </label>
                <input
                    id="telefono"
                    v-model="proveedor.telefono"
                    type="tel"
                    class="form-input"
                    :class="{ 'input-error': erroresTelefono }"
                    placeholder="Ej: 3001234567"
                    :disabled="cargando"
                    maxlength="10"
                    @blur="validarCampo('telefono')"
                    @input="limpiarErrorCampo('telefono')"
                />
                <transition name="slide">
                  <span v-if="erroresTelefono" class="error-message">
                    {{ erroresTelefono }}
                  </span>
                </transition>
                <small class="form-hint">10 dígitos numéricos</small>
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
                :disabled="cargando"
            >
              Cancelar
            </button>

            <button
                type="button"
                class="btn btn-reset"
                @click="handleLimpiar"
                :disabled="cargando"
            >
              Limpiar Formulario
            </button>

            <button
                type="submit"
                class="btn btn-primary"
                :disabled="!puedeGuardar"
            >
              <span v-if="cargando" class="spinner"></span>
              <span v-else class="icon-save">💾</span>
              {{ cargando ? 'Guardando...' : 'Crear Proveedor' }}
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
          <li>El NIT fiscal debe ser único en el sistema</li>
          <li>El email debe ser único y válido</li>
          <li>El teléfono es opcional pero debe tener 10 dígitos si se ingresa</li>
          <li>Todos los datos pueden ser editados posteriormente</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCrearProveedorViewModel } from '@/ViewModels/CrearProveedorViewModel';

const router = useRouter();

const {
  proveedor,
  cargando,
  errores,
  mensaje,
  exitoRegistro,
  erroresNombre,
  erroresNit,
  erroresTelefono,
  erroresEmail,
  puedeGuardar,
  validarCampo,
  limpiarErrorCampo,
  limpiarFormulario,
  crearProveedor
} = useCrearProveedorViewModel();

const handleCrear = async () => {
  const resultado = await crearProveedor();

  if (resultado.success) {
    setTimeout(() => {
      router.push('/proveedores');
    }, 3000);
  }
};

const handleCancelar = () => {
  if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los datos ingresados.')) {
    limpiarFormulario();
    router.push('/proveedores');
  }
};

const handleLimpiar = () => {
  if (confirm('¿Estás seguro de que deseas limpiar el formulario?')) {
    limpiarFormulario();
  }
};

const volver = () => {
  if (proveedor.value.nombre || proveedor.value.nitFiscal ||
      proveedor.value.email || proveedor.value.telefono) {
    if (confirm('¿Estás seguro de que deseas salir? Se perderán los datos ingresados.')) {
      router.push('/proveedores/CrearProveedor');
    }
  } else {
    router.push('/proveedores');
  }
};

watch(mensaje, (nuevoMensaje) => {
  if (nuevoMensaje && exitoRegistro.value) {
    setTimeout(() => {
      mensaje.value = '';
    }, 3000);
  }
});
</script>

<style scoped>
.crear-proveedor-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 900px;
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

.alert-content ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.25rem;
}

.alert-content li {
  margin-bottom: 0.25rem;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.required {
  color: #e74c3c;
  margin-left: 0.25rem;
}

.optional {
  color: #7f8c8d;
  font-weight: 400;
  font-size: 0.85rem;
  margin-left: 0.25rem;
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

.input-error {
  border-color: #e74c3c;
}

.input-error:focus {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-hint {
  color: #7f8c8d;
  font-size: 0.85rem;
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
  background: #95a5a6;
  color: white;
}

.btn-cancel:hover:not(:disabled) {
  background: #7f8c8d;
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .crear-proveedor-page {
    padding: 1rem 0;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .card-form {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
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