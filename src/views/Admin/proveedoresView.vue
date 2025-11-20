<template>
  <div class="proveedores-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h1>Gestión de Proveedores</h1>
          <p class="subtitle">Administra los proveedores de tu inventario</p>
        </div>
        <button class="btn btn-primary" @click="proveedores/CrearProveedor">
          <span class="icon">➕</span>
          Nuevo Proveedor
        </button>
      </div>

      <!-- Card de búsqueda y tabla -->
      <div class="card-content">
        <!-- Barra de búsqueda -->
        <div class="search-section">
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input
                v-model="terminoBusqueda"
                type="text"
                class="search-input"
                placeholder="Buscar por nombre o NIT fiscal..."
                @input="handleBuscar"
            />
            <button
                v-if="terminoBusqueda"
                class="btn-clear"
                @click=""
                title="Limpiar búsqueda"
            >
              ✕
            </button>
          </div>

          <!-- Filtros adicionales -->
          <div class="filters">
            <span class="results-count">
              {{ hayProveedores ? `${proveedores.length} proveedor${proveedores.length !== 1 ? 'es' : ''}` : 'Sin resultados' }}
            </span>
          </div>
        </div>

        <!-- Mensajes de error -->
        <transition name="fade">
          <div v-if="errores.length > 0" class="alert alert-danger">
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
              <strong>Error</strong>
              <ul>
                <li v-for="(error, index) in errores" :key="index">{{ error }}</li>
              </ul>
            </div>
          </div>
        </transition>

        <!-- Loading -->
        <div v-if="cargando" class="loading-container">
          <div class="spinner-large"></div>
          <p>Cargando proveedores...</p>
        </div>

        <!-- Tabla de proveedores -->
        <div v-else-if="hayProveedores" class="table-container">
          <table class="table">
            <thead>
            <tr>
              <th class="th-id">ID</th>
              <th class="th-nombre">Nombre Compañía</th>
              <th class="th-nit">NIT Fiscal</th>
              <th class="th-email">Email</th>
              <th class="th-telefono">Teléfono</th>
              <th class="th-estado">Estado</th>
              <th class="th-acciones">Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="prov in proveedores"
                :key="prov.idProveedor"
                class="table-row"
            >
              <td class="td-id">
                <span class="badge badge-id">#{{ prov.idProveedor }}</span>
              </td>
              <td class="td-nombre">
                <div class="nombre-container">
                  <span class="nombre-text">{{ prov.nombre }}</span>
                </div>
              </td>
              <td class="td-nit">
                <span class="nit-text">{{ prov.nitFiscal }}</span>
              </td>
              <td class="td-email">
                <a :href="`mailto:${prov.email}`" class="email-link">
                  {{ prov.email }}
                </a>
              </td>
              <td class="td-telefono">
                  <span v-if="prov.telefono" class="telefono-text">
                    {{ formatTelefono(prov.telefono) }}
                  </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td class="td-estado">
                  <span
                      class="badge"
                      :class="getEstadoClass(prov.estado)"
                  >
                    {{ prov.estado || 'ACTIVO' }}
                  </span>
              </td>
              <td class="td-acciones">
                <div class="actions-container">
                  <button
                      class="btn-icon btn-edit"
                      @click="editarProveedor(prov)"
                      title="Editar proveedor"
                  >
                    <span class="icon">✏️</span>
                  </button>
                  <button
                      class="btn-icon btn-view"
                      @click="verDetalles(prov)"
                      title="Ver detalles"
                  >
                    <span class="icon">👁️</span>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Sin resultados -->
        <div v-else class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>{{ terminoBusqueda ? 'No se encontraron resultados' : 'No hay proveedores registrados' }}</h3>
          <p v-if="terminoBusqueda">
            No se encontraron proveedores que coincidan con "{{ terminoBusqueda }}"
          </p>
          <p v-else>
            Comienza agregando tu primer proveedor para gestionar tu inventario
          </p>
          <button v-if="!terminoBusqueda" class="btn btn-primary" @click="irACrear">
            <span class="icon">➕</span>
            Agregar Primer Proveedor
          </button>
          <button v-else class="btn btn-secondary" @click="limpiarBusqueda">
            Limpiar búsqueda
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <transition name="modal">
      <div v-if="mostrarModal" class="modal-overlay" @click="cerrarModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Detalles del Proveedor</h3>
            <button class="btn-close" @click="cerrarModal">✕</button>
          </div>

          <div class="modal-body" v-if="proveedorSeleccionado">
            <div class="detail-section">
              <h4>Información General</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">ID</span>
                  <span class="detail-value">#{{ proveedorSeleccionado.idProveedor }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Nombre</span>
                  <span class="detail-value">{{ proveedorSeleccionado.nombre }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">NIT Fiscal</span>
                  <span class="detail-value">{{ proveedorSeleccionado.nitFiscal }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Estado</span>
                  <span
                      class="badge"
                      :class="getEstadoClass(proveedorSeleccionado.estado)"
                  >
                    {{ proveedorSeleccionado.estado || 'ACTIVO' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Información de Contacto</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Email</span>
                  <a :href="`mailto:${proveedorSeleccionado.email}`" class="detail-value detail-link">
                    {{ proveedorSeleccionado.email }}
                  </a>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Teléfono</span>
                  <span class="detail-value">
                    {{ proveedorSeleccionado.telefono ? formatTelefono(proveedorSeleccionado.telefono) : 'No registrado' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="detail-section" v-if="proveedorSeleccionado.fechaPedido || proveedorSeleccionado.total">
              <h4>Información Adicional</h4>
              <div class="detail-grid">
                <div class="detail-item" v-if="proveedorSeleccionado.fechaPedido">
                  <span class="detail-label">Fecha de Registro</span>
                  <span class="detail-value">{{ formatFecha(proveedorSeleccionado.fechaPedido) }}</span>
                </div>
                <div class="detail-item" v-if="proveedorSeleccionado.total !== null">
                  <span class="detail-label">Total Pedidos</span>
                  <span class="detail-value">${{ formatMonto(proveedorSeleccionado.total) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section" v-if="proveedorSeleccionado.notas">
              <h4>Notas</h4>
              <p class="notas-text">{{ proveedorSeleccionado.notas }}</p>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cerrarModal">
              Cerrar
            </button>
            <button class="btn btn-primary" @click="editarDesdeModal">
              <span class="icon">✏️</span>
              Editar Proveedor
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>

</style>