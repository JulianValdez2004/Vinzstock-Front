<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Página no encontrada</p>
    <router-link to="/" class="btn-home">Volver al inicio</router-link>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f7fb;
  padding: 40px;
}

.not-found h1 {
  font-size: 120px;
  margin: 0;
  color: #3b82f6;
  font-weight: 700;
}

.not-found p {
  font-size: 24px;
  color: #64748b;
  margin: 16px 0 32px 0;
}

.btn-home {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-home:hover {
  background: #2563eb;
}
</style>