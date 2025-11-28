import { ref, computed } from 'vue'
import compraService from '@/services/CompraService'
import proveedorService from '@/services/proveedorService'
import { Compra } from '@/models/Compra'

export class ListaCompraViewModel {
    constructor() {
        // Estado principal
        this.compras = ref([])
        this.proveedores = ref([])
        
        // Filtros
        this.proveedorSeleccionado = ref(null)
        this.filtroEstado = ref('Todos') // 'Todos', 'Pendiente', 'Recibido', 'Cancelado'
        
        // Estado de la operación
        this.isLoading = ref(false)
        this.loadingProveedores = ref(false)
        this.error = ref('')
        this.successMessage = ref('')
        
        // Compra seleccionada para ver detalles
        this.compraSeleccionada = ref(null)
        this.mostrarDetalles = ref(false)
        
        // Computados
        this.comprasFiltradas = computed(() => {
            let resultado = this.compras.value
            
            // Filtrar por estado
            if (this.filtroEstado.value !== 'Todos') {
                resultado = resultado.filter(c => c.estado === this.filtroEstado.value)
            }
            
            return resultado
        })
        
        this.totalCompras = computed(() => this.comprasFiltradas.value.length)
        
        this.totalPendientes = computed(() => 
            this.compras.value.filter(c => c.estado === 'Pendiente').length
        )
        
        this.totalRecibidas = computed(() => 
            this.compras.value.filter(c => c.estado === 'Recibido').length
        )
        
        this.totalCanceladas = computed(() => 
            this.compras.value.filter(c => c.estado === 'Cancelado').length
        )
        
        this.valorTotalFiltrado = computed(() => {
            return this.comprasFiltradas.value.reduce((sum, c) => sum + c.valorCompra, 0)
        })
        
        this.hayCompras = computed(() => this.compras.value.length > 0)
        
        // Inicialización
        this.loadProveedores()
    }
    
    /**
     * Cargar lista de proveedores
     */
    async loadProveedores() {
        try {
            this.loadingProveedores.value = true
            const proveedores = await proveedorService.getAllProveedores()
            this.proveedores.value = proveedores || []
            console.log('✅ Proveedores cargados:', this.proveedores.value.length)
        } catch (error) {
            console.error('❌ Error al cargar proveedores:', error)
            this.error.value = 'No se pudieron cargar los proveedores'
        } finally {
            this.loadingProveedores.value = false
        }
    }
    
    /**
     * Cargar historial de compras de un proveedor
     */
    async loadHistorial() {
        if (!this.proveedorSeleccionado.value) {
            this.compras.value = []
            this.error.value = 'Por favor selecciona un proveedor'
            return
        }
        
        try {
            this.isLoading.value = true
            this.error.value = ''
            this.successMessage.value = ''
            
            console.log('📋 Cargando historial del proveedor:', this.proveedorSeleccionado.value)
            
            const result = await compraService.getHistorialProveedor(this.proveedorSeleccionado.value)
            
            if (result.success) {
                // Convertir a objetos Compra
                this.compras.value = result.data.map(data => Compra.fromResponse(data))
                console.log(`✅ ${this.compras.value.length} compras cargadas`)
                
                if (this.compras.value.length === 0) {
                    this.error.value = 'No hay compras registradas para este proveedor'
                }
            } else {
                this.compras.value = []
                this.error.value = result.error || 'Error al cargar el historial'
            }
        } catch (error) {
            console.error('❌ Error al cargar historial:', error)
            this.compras.value = []
            this.error.value = 'Error al cargar el historial de compras'
        } finally {
            this.isLoading.value = false
        }
    }
    
    /**
     * Cambiar filtro de estado
     */
    cambiarFiltro(estado) {
        this.filtroEstado.value = estado
        console.log('🔍 Filtro cambiado a:', estado)
    }
    
    /**
     * Confirmar recepción de una compra
     */
    async confirmarRecepcion(compra) {
        if (!compra.puedeConfirmar()) {
            this.error.value = 'Esta compra no puede ser confirmada'
            return
        }
        
        const confirmacion = confirm(
            `¿Confirmar recepción de la compra #${compra.idCompra}?\n\n` +
            `Esto actualizará el inventario con los productos recibidos.`
        )
        
        if (!confirmacion) return
        
        try {
            this.isLoading.value = true
            this.clearMessages()
            
            const result = await compraService.confirmarRecepcion(compra.idCompra)
            
            if (result.success) {
                this.successMessage.value = result.message || 'Compra confirmada exitosamente'
                
                // Recargar historial
                await this.loadHistorial()
            } else {
                this.error.value = result.error || 'Error al confirmar la compra'
            }
        } catch (error) {
            console.error('❌ Error al confirmar:', error)
            this.error.value = 'Error al confirmar la recepción'
        } finally {
            this.isLoading.value = false
        }
    }
    
    /**
     * Cancelar una compra
     */
    async cancelarCompra(compra) {
        if (!compra.puedeCancelar()) {
            this.error.value = 'Esta compra no puede ser cancelada'
            return
        }
        
        const confirmacion = confirm(
            `¿Cancelar la compra #${compra.idCompra}?\n\n` +
            `Esta acción cambiará el estado a "Cancelado".`
        )
        
        if (!confirmacion) return
        
        try {
            this.isLoading.value = true
            this.clearMessages()
            
            const result = await compraService.cancelarCompra(compra.idCompra)
            
            if (result.success) {
                this.successMessage.value = result.message || 'Compra cancelada exitosamente'
                
                // Recargar historial
                await this.loadHistorial()
            } else {
                this.error.value = result.error || 'Error al cancelar la compra'
            }
        } catch (error) {
            console.error('❌ Error al cancelar:', error)
            this.error.value = 'Error al cancelar la compra'
        } finally {
            this.isLoading.value = false
        }
    }
    
    /**
     * Eliminar una compra completamente
     */
    async eliminarCompra(compra) {
        if (!compra.puedeEliminar()) {
            this.error.value = 'No se pueden eliminar compras recibidas (el inventario ya fue actualizado)'
            return
        }
        
        const confirmacion = confirm(
            `¿ELIMINAR PERMANENTEMENTE la compra #${compra.idCompra}?\n\n` +
            `⚠️ Esta acción NO se puede deshacer.\n` +
            `La compra será eliminada de la base de datos.`
        )
        
        if (!confirmacion) return
        
        try {
            this.isLoading.value = true
            this.clearMessages()
            
            const result = await compraService.eliminarCompra(compra.idCompra)
            
            if (result.success) {
                this.successMessage.value = result.message || 'Compra eliminada exitosamente'
                
                // Recargar historial
                await this.loadHistorial()
            } else {
                this.error.value = result.error || 'Error al eliminar la compra'
            }
        } catch (error) {
            console.error('❌ Error al eliminar:', error)
            this.error.value = 'Error al eliminar la compra'
        } finally {
            this.isLoading.value = false
        }
    }
    
    /**
     * Borrar TODO el historial del proveedor
     */
    async borrarHistorialCompleto() {
        if (!this.proveedorSeleccionado.value) {
            this.error.value = 'Selecciona un proveedor primero'
            return
        }
        
        const proveedor = this.proveedores.value.find(p => p.idProveedor === this.proveedorSeleccionado.value)
        const nombreProveedor = proveedor?.nombre || 'este proveedor'
        
        const confirmacion = confirm(
            `⚠️ ¿BORRAR TODO EL HISTORIAL de ${nombreProveedor}?\n\n` +
            `Esto eliminará TODAS las compras (${this.compras.value.length} compras).\n` +
            `Esta acción NO se puede deshacer.\n\n` +
            `¿Estás completamente seguro?`
        )
        
        if (!confirmacion) return
        
        // Segunda confirmación
        const segundaConfirmacion = confirm(
            `⚠️ ÚLTIMA CONFIRMACIÓN\n\n` +
            `Se eliminarán ${this.compras.value.length} compras de forma permanente.\n\n` +
            `Escribe "CONFIRMAR" en tu mente y presiona OK para continuar.`
        )
        
        if (!segundaConfirmacion) return
        
        try {
            this.isLoading.value = true
            this.clearMessages()
            
            const result = await compraService.borrarHistorialProveedor(this.proveedorSeleccionado.value)
            
            if (result.success) {
                this.successMessage.value = result.message || 'Historial eliminado exitosamente'
                this.compras.value = []
            } else {
                this.error.value = result.error || 'Error al borrar el historial'
            }
        } catch (error) {
            console.error('❌ Error al borrar historial:', error)
            this.error.value = 'Error al borrar el historial'
        } finally {
            this.isLoading.value = false
        }
    }
    
    /**
     * Ver detalles de una compra
     */
    verDetalles(compra) {
        this.compraSeleccionada.value = compra
        this.mostrarDetalles.value = true
    }
    
    /**
     * Cerrar modal de detalles
     */
    cerrarDetalles() {
        this.mostrarDetalles.value = false
        this.compraSeleccionada.value = null
    }
    
    /**
     * Limpiar mensajes
     */
    clearMessages() {
        this.error.value = ''
        this.successMessage.value = ''
    }
    
    /**
     * Reiniciar vista
     */
    resetView() {
        this.proveedorSeleccionado.value = null
        this.compras.value = []
        this.filtroEstado.value = 'Todos'
        this.clearMessages()
    }
}