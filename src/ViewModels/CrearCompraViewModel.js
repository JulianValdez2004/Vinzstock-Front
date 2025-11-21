import { ref, computed } from 'vue'
import compraService from '@/services/CompraService'
import { CompraRegistro, DetalleCompra } from '@/models/CompraRegistro'
import proveedorService from '@/services/proveedorService'
import productoService from '@/services/productoService'

export class CrearCompraViewModel {
    constructor() {
        // Estado del formulario
        this.idProveedor = ref(null)
        this.detalles = ref([new DetalleCompra()])
        this.proveedores = ref([])
        this.productos = ref([])

        // Estado de la operación
        this.error = ref('')
        this.successMessage = ref('')
        this.isLoading = ref(false)

        // Computados
        this.totalCompra = computed(() =>
            this.detalles.value.reduce((acc, d) => acc + (d.cantidad * d.precioUnitario), 0)
        )

        this.totalFormateado = computed(() =>
            new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP'
            }).format(this.totalCompra.value)
        )

        // Inicialización
        this.loadProveedores()
    }

    async loadProveedores() {
        try {
            const proveedores = await proveedorService.getAllProveedores()
            this.proveedores.value = proveedores
        } catch (error) {
            console.error('Error al cargar proveedores:', error)
            this.error.value = 'No se pudieron cargar los proveedores'
        }
    }

    async loadProductos() {
        try {
            const productos = await productoService.getAllProductos()
            this.productos.value = productos
        } catch (error) {
            console.error('Error al cargar productos:', error)
            this.error.value = 'No se pudieron cargar los productos'
        }
    }

    agregarDetalle() {
        this.detalles.value.push(new DetalleCompra())
    }

    eliminarDetalle(index) {
        this.detalles.value.splice(index, 1)
    }

    clearMessages() {
        this.error.value = ''
        this.successMessage.value = ''
    }

    clearForm() {
        this.idProveedor.value = null
        this.detalles.value = [new DetalleCompra()]
        this.clearMessages()
    }

    validateForm() {
        const compra = new CompraRegistro({
            idProveedor: this.idProveedor.value,
            detalles: this.detalles.value
        })

        return compra.validate()
    }

    async executeCreate() {
        this.clearMessages()

        const compra = new CompraRegistro({
            idProveedor: this.idProveedor.value,
            detalles: this.detalles.value
        })

        const validation = compra.validate()
        if (!validation.isValid) {
            this.error.value = validation.errors[0]
            return { success: false, error: validation.errors[0] }
        }

        this.isLoading.value = true

        try {
            const result = await compraService.registrarCompra(compra.toJSON())

            if (result.success) {
                this.successMessage.value = result.message
                setTimeout(() => this.clearForm(), 2000)
                return result
            } else {
                this.error.value = result.error
                return result
            }
        } catch (err) {
            console.error('Error inesperado al registrar compra:', err)
            this.error.value = 'Error inesperado. Por favor intenta nuevamente.'
            return { success: false, error: this.error.value }
        } finally {
            this.isLoading.value = false
        }
    }
}
