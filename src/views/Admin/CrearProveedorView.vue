<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Crear Proveedor</h1>

    <div class="bg-white shadow-md p-6 rounded-lg space-y-4">

      <!-- Nombre Compañía -->
      <div>
        <label class="block font-medium">Nombre Compañía *</label>
        <input
            v-model="proveedor.nombreCompania"
            @blur="validarNombre"
            type="text"
            class="input"
        />
        <p v-if="!nombreDisponible" class="text-red-500 text-sm">
          Ya existe una empresa con ese nombre
        </p>
      </div>

      <!-- Tipo ID -->
      <div>
        <label class="block font-medium">Tipo de Identificación *</label>
        <select v-model="proveedor.tipoIdentificacion" class="input">
          <option disabled value="">Seleccione...</option>
          <option>NIT</option>
          <option>RUC</option>
          <option>CC</option>
        </select>
      </div>

      <!-- NIT -->
      <div>
        <label class="block font-medium">NIT Fiscal *</label>
        <input
            v-model="proveedor.nitFiscal"
            @blur="validarNit"
            type="text"
            class="input"
        />
        <p v-if="!nitDisponible" class="text-red-500 text-sm">
          NIT ya registrado
        </p>
      </div>

      <!-- Email -->
      <div>
        <label class="block font-medium">Correo electrónico *</label>
        <input
            v-model="proveedor.email"
            @blur="validarEmail"
            type="email"
            class="input"
        />
        <p v-if="!emailDisponible" class="text-red-500 text-sm">
          Ya existe un proveedor con ese email
        </p>
      </div>

      <!-- Número contacto -->
      <div>
        <label class="block font-medium">Número de contacto</label>
        <input v-model="proveedor.numeroContacto" type="text" class="input" />
      </div>

      <!-- Producto nombre -->
      <div>
        <label class="block font-medium">Producto Nombre</label>
        <input v-model="proveedor.productoNombre" type="text" class="input" />
      </div>

      <!-- Producto descripción -->
      <div>
        <label class="block font-medium">Producto Descripción</label>
        <textarea v-model="proveedor.productoDescripcion" class="input"></textarea>
      </div>

      <!-- Forma pago -->
      <div>
        <label class="block font-medium">Forma de Pago *</label>
        <select v-model="proveedor.formaPago" class="input">
          <option disabled value="">Seleccione...</option>
          <option>Contra entrega</option>
          <option>Tarjeta</option>
          <option>Consignación</option>
        </select>
      </div>

      <!-- Fecha pedido -->
      <div>
        <label class="block font-medium">Fecha de Pedido *</label>
        <input v-model="proveedor.fechaPedido" type="date" class="input" />
      </div>

      <div class="flex justify-between mt-6">
        <button @click="$router.push('/admin/proveedores')" class="btn-cancel">
          Cancelar
        </button>

        <button
            :disabled="!isFormValid || loading"
            @click="crearProveedor"
            class="btn-primary"
        >
          Crear Proveedor
        </button>
      </div>

      <p v-if="mensaje" class="text-center font-semibold mt-2">
        {{ mensaje }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useCrearProveedorViewModel } from "../viewmodels/CrearProveedorViewModel";

const {
  proveedor,
  nombreDisponible,
  emailDisponible,
  nitDisponible,
  loading,
  mensaje,
  validarNombre,
  validarEmail,
  validarNit,
  isFormValid,
  crearProveedor,
} = useCrearProveedorViewModel();
</script>

<style>
.input {
  @apply w-full p-2 border rounded-md;
}

.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50;
}

.btn-cancel {
  @apply bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400;
}
</style>