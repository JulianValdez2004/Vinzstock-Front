<template>
  <form class="recover-card" @submit.prevent="handleRecoverPassword">
    <h2>Recuperar contraseña</h2>

    <div v-if="viewModel.hasError.value" class="error-message">
      {{ viewModel.error.value }}
    </div>

    <div v-if="viewModel.successMessage.value" class="success-message">
      {{ viewModel.successMessage.value }}
    </div>

    <label for="email">Correo electrónico</label>
    <input
        id="email"
        type="email"
        v-model="viewModel.email.value"
        placeholder="Ingresa tu correo registrado"
        :disabled="viewModel.isLoading.value"
        required
    />

    <button type="submit" class="btn" :disabled="viewModel.isLoading.value">
      {{ viewModel.isLoading.value ? "Enviando..." : "Enviar enlace" }}
    </button>

    <router-link to="/" class="back-link">
      ← Volver al inicio de sesión
    </router-link>
  </form>
</template>

<script setup>
import { useRouter } from "vue-router";
import { RecuperarContrasenaViewModel } from "@/ViewModels/RecuperarContrasenaViewModel.js";

const router = useRouter();
const viewModel = new RecuperarContrasenaViewModel();

async function handleRecoverPassword() {
  await viewModel.executeRecoverPassword();
}
</script>

<style scoped>
.recover-card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  padding: 28px;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recover-card h2 {
  margin: 0 0 8px 0;
  text-align: center;
  font-size: 20px;
  color: #0f172a;
}

.recover-card label {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
}

.recover-card input {
  padding: 10px 12px;
  border: 1px solid #e6edf3;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.recover-card input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06);
}

.btn {
  margin-top: 8px;
  padding: 10px 12px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;
}

.btn:hover:not(:disabled) {
  background: #1e40af;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-link {
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.error-message {
  padding: 10px 12px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid #fecaca;
  animation: slideIn 0.3s ease-out;
}

.success-message {
  padding: 10px 12px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 6px;
  font-size: 13px;
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