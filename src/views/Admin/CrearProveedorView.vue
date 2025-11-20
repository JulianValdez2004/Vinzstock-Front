<template>
  <div class="container">
    <h1>Crear Proveedor</h1>

    <form @submit.prevent="vm.crearProveedor">
      <!-- Nombre Compañía -->
      <label>Nombre Compañía *</label>
      <input
          type="text"
          v-model="vm.proveedor.nombreCompania"
          @blur="vm.validarNombre"
          placeholder="Ingrese nombre de la compañía"
      />
      <span v-if="!vm.proveedor.nombreCompania" class="error-msg">
        Este campo es obligatorio
      </span>
      <span v-if="!vm.nombreDisponible" class="error-msg">
        El nombre ya está en uso
      </span>

      <!-- Tipo Identificación -->
      <label>Tipo de Identificación *</label>
      <select v-model="vm.proveedor.tipoIdentificacion">
        <option value="">Seleccione...</option>
        <option value="NIT">NIT</option>
        <option value="RUC">RUC</option>
      </select>
      <span v-if="!vm.proveedor.tipoIdentificacion" class="error-msg">
        Debe seleccionar un tipo de identificación
      </span>

      <!-- NIT Fiscal -->
      <label>NIT / RUC *</label>
      <input
          type="text"
          v-model="vm.proveedor.nitFiscal"
          @blur="vm.validarNit"
          placeholder="Ingrese NIT o RUC"
      />
      <span v-if="!vm.proveedor.nitFiscal" class="error-msg">
        Este campo es obligatorio
      </span>
      <span v-if="!vm.nitDisponible" class="error-msg">
        El NIT/RUC ya está en uso
      </span>

      <!-- Email -->
      <label>Email *</label>
      <input
          type="email"
          v-model="vm.proveedor.email"
          @blur="vm.validarEmail"
          placeholder="Ingrese email"
      />
      <span v-if="!vm.proveedor.email" class="error-msg">
        Este campo es obligatorio
      </span>
      <span v-if="!vm.emailDisponible" class="error-msg">
        El email ya está en uso
      </span>

      <!-- Número de contacto -->
      <label>Teléfono / Contacto</label>
      <input
          type="text"
          v-model="vm.proveedor.numeroContacto"
          placeholder="Ingrese número de contacto"
      />

      <!-- Producto Nombre -->
      <label>Nombre del Producto</label>
      <input
          type="text"
          v-model="vm.proveedor.productoNombre"
          placeholder="Nombre máximo 20 caracteres"
      />
      <span v-if="vm.proveedor.productoNombre.length > 20" class="error-msg">
        Máximo 20 caracteres
      </span>

      <!-- Producto Descripción -->
      <label>Descripción del Producto</label>
      <textarea
          v-model="vm.proveedor.productoDescripcion"
          placeholder="Descripción máxima 120 caracteres"
      ></textarea>
      <span v-if="vm.proveedor.productoDescripcion.length > 120" class="error-msg">
        Máximo 120 caracteres
      </span>

      <!-- Forma de Pago -->
      <label>Forma de Pago *</label>
      <select v-model="vm.proveedor.formaPago">
        <option value="">Seleccione...</option>
        <option value="Contra entrega">Contra entrega</option>
        <option value="Tarjeta">Tarjeta</option>
        <option value="Consignación">Consignación</option>
      </select>
      <span v-if="!vm.proveedor.formaPago" class="error-msg">
        Debe seleccionar una forma de pago
      </span>

      <!-- Fecha de Pedido -->
      <label>Fecha de Pedido *</label>
      <input type="date" v-model="vm.proveedor.fechaPedido" />
      <span v-if="!vm.proveedor.fechaPedido" class="error-msg">
        Debe seleccionar una fecha
      </span>

      <!-- Mensaje general -->
      <p v-if="vm.mensaje" :class="{ success: mensajeExito, error: !mensajeExito }">
        {{ vm.mensaje }}
      </p>

      <button type="submit" :disabled="vm.loading || !vm.isFormValid">
        {{ vm.loading ? "Creando..." : "Crear Proveedor" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { useCrearProveedorViewModel } from "@/ViewModels/CrearProveedorViewModel";

const vm = useCrearProveedorViewModel();

// Computed para mensaje de éxito/error
const mensajeExito = computed(() => vm.mensaje && vm.mensaje.includes("éxito"));
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

label {
  display: block;
  margin-top: 15px;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 60px;
}

.error-msg {
  color: red;
  font-size: 0.9rem;
}

.success {
  color: green;
  font-weight: bold;
}

button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
