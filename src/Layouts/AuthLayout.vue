<template>
  <div class="auth-layout">
    <div class="auth-content">
      <!-- Logo o branding -->
      <div class="auth-header">
        <h1 class="brand">VinzStock</h1>
        <p class="tagline">Sistema de Gestión de Inventario</p>
      </div>

      <!-- Aquí se renderizan las vistas de auth (login, registro, etc.) -->
      <router-view />

      <!-- Footer -->
      <div class="auth-footer">
        <p>&copy; 2025 VinzStock. Todos los derechos reservados.</p>
      </div>
    </div>

    <!-- Decoración opcional -->
    <div class="auth-background">
      <div class="decoration"></div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.auth-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  z-index: 1;
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
}

.brand {
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tagline {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.auth-footer {
  margin-top: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.decoration {
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  top: -400px;
  right: -400px;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-50px, 50px) scale(1.1); }
}

@media (max-width: 768px) {
  .brand {
    font-size: 36px;
  }
}
</style>