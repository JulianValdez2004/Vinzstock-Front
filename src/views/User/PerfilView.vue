<template>
  <div class="perfil">
    <h2>Mi Perfil</h2>

    <div class="perfil-content">
      <div class="perfil-card">
        <div class="avatar-section">
          <div class="avatar-large">{{ userInitials }}</div>
          <h3>{{ usuario?.nombre }}</h3>
          <p class="role-badge">{{ usuario?.nombreRol }}</p>
        </div>

        <div class="info-section">
          <div class="info-row">
            <span class="label">Usuario:</span>
            <span class="value">{{ usuario?.usuarioLogin }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ usuario?.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">Estado:</span>
            <span :class="['status-badge', usuario?.estado == true || usuario?.estado === 'true' ? 'active' : 'inactive']">
              {{ usuario?.estado == true || usuario?.estado === 'true' ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>

        <div class="actions-section">
          <button class="btn-primary">Editar Perfil</button>
          <button class="btn-secondary">Cambiar Contraseña</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth.js'

const { usuario, userInitials } = useAuth()

</script>

<style scoped>
.perfil {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.perfil h2 {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
  font-weight: 600;
}

.perfil-content {
  max-width: 600px;
}

.perfil-card {
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 36px;
}

.avatar-section h3 {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
}

.role-badge {
  margin: 0;
  padding: 6px 16px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.value {
  font-size: 14px;
  color: #0f172a;
  font-weight: 600;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #dc2626;
}

.actions-section {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
}
</style>