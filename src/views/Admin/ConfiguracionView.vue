<template>
  <div class="configuracion">
    <h2>Configuración del Sistema</h2>

    <div class="config-sections">
      <div class="config-card">
        <h3>🏢 Información de la Empresa</h3>
        <p>Configura los datos de tu empresa</p>
        <button class="btn-secondary">Configurar</button>
      </div>

      <div class="config-card">
        <h3>🔐 Seguridad</h3>
        <p>Políticas de contraseñas y sesiones</p>
        <button class="btn-secondary">Configurar</button>
      </div>

      <div class="config-card">
        <h3>📧 Notificaciones</h3>
        <p>Configuración de correos electrónicos</p>
        <button class="btn-secondary">Configurar</button>
      </div>

      <div class="config-card">
        <h3>💾 Respaldo</h3>
        <p>Copia de seguridad de datos</p>
        <button class="btn-secondary">Configurar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.configuracion {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.configuracion h2 {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
  font-weight: 600;
}

.config-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.config-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-card h3 {
  margin: 0;
  font-size: 18px;
  color: #0f172a;
}

.config-card p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.btn-secondary {
  padding: 8px 16px;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: background 0.2s;
  align-self: flex-start;
}

.btn-secondary:hover {
  background: #e2e8f0;
}
</style>