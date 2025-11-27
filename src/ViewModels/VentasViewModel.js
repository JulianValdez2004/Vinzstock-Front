import { ref, computed } from 'vue'
import clienteService from '@/services/clienteService'

export class VentasViewModel {
    constructor() {
        // Estado de clientes
        this.clientes = ref([])
        this.clientesFiltrados = ref([])
        this.totalClientes = ref(0)

        // Estado de búsqueda
        this.searchTerm = ref('')

        // Estado de la operación
        this.isLoading = ref(false)
        this.error = ref('')

        // Cliente seleccionado para modal
        this.clienteSeleccionado = ref(null)
        this.mostrarModal = ref(false)

        // Computados
        this.hayClientes = computed(() => {
            return this.clientesFiltrados.value.length > 0
        })

        this.clientesActivos = computed(() => {
            return this.clientesFiltrados.value.filter(c => c.estaActivo())
        })

        this.contadorResultados = computed(() => {
            const total = this.clientesFiltrados.value.length
            return total === 1 ? '1 cliente' : `${total} clientes`
        })
    }

    /**
     * Cargar todos los clientes
     */
    async loadClientes() {
        this.isLoading.value = true
        this.error.value = ''

        try {
            const result = await clienteService.getAllClientes()

            if (result.success) {
                this.clientes.value = result.data
                this.clientesFiltrados.value = result.data
                this.totalClientes.value = result.total
            } else {
                this.error.value = result.error
                this.clientes.value = []
                this.clientesFiltrados.value = []
            }
        } catch (err) {
            console.error('Error al cargar clientes:', err)
            this.error.value = 'Error al cargar los clientes'
            this.clientes.value = []
            this.clientesFiltrados.value = []
        } finally {
            this.isLoading.value = false
        }
    }

    /**
     * Buscar clientes por nombre o documento
     */
    buscarClientes() {
        const termino = this.searchTerm.value.toLowerCase().trim()

        if (!termino) {
            this.clientesFiltrados.value = this.clientes.value
            return
        }

        this.clientesFiltrados.value = this.clientes.value.filter(cliente => {
            const nombre = cliente.nombreRazonSocial.toLowerCase()
            const documento = cliente.numeroDocumento.toLowerCase()

            return nombre.includes(termino) || documento.includes(termino)
        })
    }

    /**
     * Limpiar búsqueda
     */
    limpiarBusqueda() {
        this.searchTerm.value = ''
        this.clientesFiltrados.value = this.clientes.value
    }

    /**
     * Ver detalles del cliente en modal
     */
    verDetalles(cliente) {
        this.clienteSeleccionado.value = cliente
        this.mostrarModal.value = true
    }

    /**
     * Cerrar modal de detalles
     */
    cerrarModal() {
        this.mostrarModal.value = false
        setTimeout(() => {
            this.clienteSeleccionado.value = null
        }, 300)
    }

    /**
     * Formatear documento para mostrar
     */
    formatearDocumento(cliente) {
        return cliente.formatearDocumento()
    }

    /**
     * Obtener clase CSS según estado
     */
    getEstadoClass(cliente) {
        return {
            'badge-activo': cliente.estaActivo(),
            'badge-inactivo': !cliente.estaActivo()
        }
    }

    /**
     * Obtener ícono según tipo de documento
     */
    getIconoTipoDocumento(cliente) {
        const tipo = cliente.getTipoDocumento()
        return tipo === 'CC' ? '👤' : tipo === 'NIT' ? '🏢' : '📄'
    }

    /**
     * Recargar lista de clientes
     */
    async recargar() {
        this.limpiarBusqueda()
        await this.loadClientes()
    }

    /**
     * Limpiar error
     */
    clearError() {
        this.error.value = ''
    }
}

export default VentasViewModel