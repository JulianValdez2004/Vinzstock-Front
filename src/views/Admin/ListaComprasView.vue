<template>
  <div class="lista-compra-view">
    <!-- Header -->
    <div class="header-section">
      <div class="header-left">
        <h2>📋 Historial de Compras</h2>
        <p class="subtitle">Gestiona y consulta las compras por proveedor</p>
      </div>
    </div>

    <!-- Mensajes -->
    <div v-if="viewModel.error.value" class="error-message">
      {{ viewModel.error.value }}
    </div>

    <div v-if="viewModel.successMessage.value" class="success-message">
      {{ viewModel.successMessage.value }}
    </div>

    <!-- Selector de Proveedor -->
    <div class="selector-section">
      <div class="form-group">
        <label for="proveedor">Selecciona un Proveedor</label>
        <div class="selector-with-button">
          <select
            id="proveedor"
            v-model="viewModel.proveedorSeleccionado.value"
            @change="onProveedorChange"
            :disabled="viewModel.loadingProveedores.value"
            class="proveedor-select"
          >
            <option :value="null" disabled>-- Selecciona un proveedor --</option>
            <option
              v-for="proveedor in viewModel.proveedores.value"
              :key="proveedor.idProveedor"
              :value="proveedor.idProveedor"
            >
              {{ proveedor.nombre }} (NIT: {{ proveedor.nitFiscal }})
            </option>
          </select>
          
          <button
            v-if="viewModel.hayCompras.value"
            @click="viewModel.borrarHistorialCompleto()"
            class="btn-danger"
            :disabled="viewModel.isLoading.value"
            title="Borrar todo el historial"
          >
            🗑️ Borrar Historial
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros de Estado (Chips) -->
    <div v-if="viewModel.hayCompras.value" class="filtros-section">
      <button
        @click="viewModel.cambiarFiltro('Todos')"
        :class="['chip', { active: viewModel.filtroEstado.value === 'Todos' }]"
      >
        📊 Todos
        <span class="badge">{{ viewModel.totalCompras.value }}</span>
      </button>
      
      <button
        @click="viewModel.cambiarFiltro('Pendiente')"
        :class="['chip', 'chip-pending', { active: viewModel.filtroEstado.value === 'Pendiente' }]"
      >
        ⏳ Pendientes
        <span class="badge">{{ viewModel.totalPendientes.value }}</span>
      </button>
      
      <button
        @click="viewModel.cambiarFiltro('Recibido')"
        :class="['chip', 'chip-received', { active: viewModel.filtroEstado.value === 'Recibido' }]"
      >
        ✅ Recibidos
        <span class="badge">{{ viewModel.totalRecibidas.value }}</span>
      </button>
      
      <button
        @click="viewModel.cambiarFiltro('Cancelado')"
        :class="['chip', 'chip-cancelled', { active: viewModel.filtroEstado.value === 'Cancelado' }]"
      >
        ❌ Cancelados
        <span class="badge">{{ viewModel.totalCanceladas.value }}</span>
      </button>
    </div>

    <!-- Tabla de Compras -->
    <div class="table-container">
      <!-- Loading -->
      <div v-if="viewModel.isLoading.value" class="loading">
        <div class="spinner"></div>
        <p>Cargando historial...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!viewModel.proveedorSeleccionado.value" class="empty-state">
        <span class="empty-icon">🔍</span>
        <h3>Selecciona un proveedor</h3>
        <p>Elige un proveedor para ver su historial de compras</p>
      </div>

      <div v-else-if="viewModel.comprasFiltradas.value.length === 0" class="empty-state">
        <span class="empty-icon">📦</span>
        <h3>No hay compras</h3>
        <p v-if="viewModel.filtroEstado.value !== 'Todos'">
          No hay compras con estado "{{ viewModel.filtroEstado.value }}"
        </p>
        <p v-else>Este proveedor no tiene compras registradas</p>
      </div>

      <!-- Tabla -->
      <table v-else class="compras-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Productos</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="compra in viewModel.comprasFiltradas.value"
            :key="compra.idCompra"
            :class="['compra-row', `estado-${compra.estado.toLowerCase()}`]"
          >
            <td class="id-cell">#{{ compra.idCompra }}</td>
            
            <td>{{ compra.getFechaFormateada() }}</td>
            
            <td class="hora-cell">{{ compra.getHoraFormateada() }}</td>
            
            <td class="productos-cell">
              <button
                @click="viewModel.verDetalles(compra)"
                class="btn-ver-detalles"
              >
                📦 {{ compra.getTotalProductos() }} productos
                ({{ compra.getTotalUnidades() }} unidades)
              </button>
            </td>
            
            <td>
              <span :class="['estado-badge', compra.getEstadoBadge().class]">
                {{ compra.getEstadoBadge().icon }} {{ compra.getEstadoBadge().text }}
              </span>
            </td>
            
            <td class="total-cell">{{ compra.getValorFormateado() }}</td>
            
            <td class="acciones-cell">
              <!-- Botones SOLO para pendientes -->
              <div v-if="compra.estado === 'Pendiente'" class="acciones-pendiente">
                <button
                  @click="viewModel.confirmarRecepcion(compra)"
                  class="btn-confirmar"
                  title="Confirmar recepción"
                  :disabled="viewModel.isLoading.value"
                >
                  ✅ Confirmar
                </button>
                
                <button
                  @click="viewModel.cancelarCompra(compra)"
                  class="btn-cancelar"
                  title="Cancelar compra"
                  :disabled="viewModel.isLoading.value"
                >
                  ❌ Cancelar
                </button>
              </div>
              
              <!-- Solo ver detalles para recibidos -->
              <div v-else-if="compra.estado === 'Recibido'" class="acciones-recibido">
                <span class="texto-recibido">Compra recibida</span>
              </div>
              
              <!-- Eliminar para cancelados -->
              <div v-else class="acciones-cancelado">
                <button
                  @click="viewModel.eliminarCompra(compra)"
                  class="btn-eliminar"
                  title="Eliminar compra"
                  :disabled="viewModel.isLoading.value"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Resumen -->
      <div v-if="viewModel.comprasFiltradas.value.length > 0" class="resumen-section">
        <div class="resumen-item">
          <span class="resumen-label">Total de compras:</span>
          <span class="resumen-value">{{ viewModel.totalCompras.value }}</span>
        </div>
        <div class="resumen-item">
          <span class="resumen-label">Valor total:</span>
          <span class="resumen-value total">
            {{ new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(viewModel.valorTotalFiltrado.value) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div
      v-if="viewModel.mostrarDetalles.value"
      class="modal-overlay"
      @click.self="viewModel.cerrarDetalles()"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h3>📦 Detalles de la Compra #{{ viewModel.compraSeleccionada.value?.idCompra }}</h3>
          <button @click="viewModel.cerrarDetalles()" class="btn-close">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Proveedor:</span>
              <span class="info-value">{{ viewModel.compraSeleccionada.value?.nombreProveedor }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">NIT:</span>
              <span class="info-value">{{ viewModel.compraSeleccionada.value?.nitProveedor }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Fecha:</span>
              <span class="info-value">{{ viewModel.compraSeleccionada.value?.getFechaFormateada() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Hora:</span>
              <span class="info-value">{{ viewModel.compraSeleccionada.value?.getHoraFormateada() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Estado:</span>
              <span :class="['estado-badge', viewModel.compraSeleccionada.value?.getEstadoBadge().class]">
                {{ viewModel.compraSeleccionada.value?.getEstadoBadge().icon }}
                {{ viewModel.compraSeleccionada.value?.getEstadoBadge().text }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Total:</span>
              <span class="info-value total">{{ viewModel.compraSeleccionada.value?.getValorFormateado() }}</span>
            </div>
          </div>
          
          <h4>Productos</h4>
          <table class="detalles-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Costo Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detalle in viewModel.compraSeleccionada.value?.detalles" :key="detalle.idDetalleCompra">
                <td>
                  <strong>{{ detalle.nombreProducto }}</strong>
                  <p class="descripcion-detalle">{{ detalle.descripcionProducto }}</p>
                </td>
                <td class="cantidad-cell">{{ detalle.cantidad }}</td>
                <td>{{ detalle.getCostoUnitarioFormateado() }}</td>
                <td class="subtotal-cell">{{ detalle.getCostoTotalFormateado() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ListaCompraViewModel } from '@/ViewModels/ListaCompraViewModel'

const viewModel = new ListaCompraViewModel()

async function onProveedorChange() {
  await viewModel.loadHistorial()
}
</script>

<style scoped>
.lista-compra-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left h2 {
  margin: 0 0 4px 0;
  font-size: 24px;
  color: #0f172a;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

/* Mensajes */
.error-message {
  padding: 12px 16px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #fecaca;
}

.success-message {
  padding: 12px 16px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #bbf7d0;
}

/* Selector */
.selector-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.selector-with-button {
  display: flex;
  gap: 12px;
}

.proveedor-select {
  flex: 1;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.proveedor-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-danger {
  padding: 12px 20px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Filtros (Chips) */
.filtros-section {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.chip {
  padding: 10px 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chip:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.chip.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.chip-pending.active {
  background: #f59e0b;
  border-color: #f59e0b;
}

.chip-received.active {
  background: #10b981;
  border-color: #10b981;
}

.chip-cancelled.active {
  background: #ef4444;
  border-color: #ef4444;
}

.chip .badge {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.chip.active .badge {
  background: rgba(255, 255, 255, 0.3);
}

/* Tabla */
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  overflow: hidden;
}

.loading {
  padding: 60px;
  text-align: center;
  color: #64748b;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f1f5f9;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #64748b;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  display: block;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #0f172a;
  font-size: 20px;
}

.compras-table {
  width: 100%;
  border-collapse: collapse;
}

.compras-table thead {
  background: #f8fafc;
}

.compras-table th {
  padding: 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  border-bottom: 2px solid #e2e8f0;
}

.compras-table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

.compras-table tbody tr:hover {
  background: #f8fafc;
}

.id-cell {
  font-weight: 700;
  color: #3b82f6;
}

.hora-cell {
  color: #64748b;
  font-size: 13px;
}

.productos-cell {
  text-align: center;
}

.btn-ver-detalles {
  padding: 6px 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #1e40af;
  transition: all 0.2s;
}

.btn-ver-detalles:hover {
  background: #dbeafe;
}

.estado-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
}

.badge-pending {
  background: #fef3c7;
  color: #d97706;
}

.badge-received {
  background: #dcfce7;
  color: #16a34a;
}

.badge-cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.total-cell {
  font-weight: 700;
  font-size: 15px;
  color: #0f172a;
}

/* Acciones */
.acciones-cell {
  min-width: 250px;
}

.acciones-pendiente {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-confirmar,
.btn-cancelar,
.btn-eliminar {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-confirmar {
  background: #10b981;
  color: white;
}

.btn-confirmar:hover:not(:disabled) {
  background: #059669;
}

.btn-cancelar {
  background: #ef4444;
  color: white;
}

.btn-cancelar:hover:not(:disabled) {
  background: #dc2626;
}

.btn-eliminar {
  background: #dc2626;
  color: white;
}

.btn-eliminar:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-confirmar:disabled,
.btn-cancelar:disabled,
.btn-eliminar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.texto-recibido {
  color: #16a34a;
  font-weight: 600;
  font-size: 13px;
}

/* Resumen */
.resumen-section {
  padding: 20px;
  background: #f8fafc;
  border-top: 2px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 40px;
}

.resumen-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.resumen-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 4px;
}

.resumen-value {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.resumen-value.total {
  font-size: 20px;
  color: #3b82f6;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #0f172a;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.btn-close:hover {
  background: #f1f5f9;
}

.modal-body {
  padding: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.info-value {
  font-size: 15px;
  color: #0f172a;
  font-weight: 600;
}

.modal-body h4 {
  margin: 24px 0 16px 0;
  font-size: 16px;
  color: #0f172a;
}

.detalles-table {
  width: 100%;
  border-collapse: collapse;
}

.detalles-table th,
.detalles-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.detalles-table th {
  background: #f8fafc;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.descripcion-detalle {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #64748b;
}

.cantidad-cell {
  text-align: center;
  font-weight: 700;
  color: #3b82f6;
}

.subtotal-cell {
  text-align: right;
  font-weight: 700;
  color: #0f172a;
}
</style>