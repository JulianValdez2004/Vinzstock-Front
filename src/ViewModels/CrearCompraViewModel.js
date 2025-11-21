import { ref, computed } from 'vue'
import compraService from '@/services/CompraService'
import proveedorService from '@/services/proveedorService'
import { CompraRegistro, DetalleCompra } from '@/models/CompraRegistro'

export class CrearCompraViewModel {
    constructor() {
        // Estado del formulario
        this.idProveedor = ref(null)
        this.detalles = ref([this.crearDetalleVacio()])
        this.proveedores = ref([])
        this.productos = ref([])

        // Estado de la operación
        this.error = ref('')
        this.successMessage = ref('')
        this.isLoading = ref(false)
        this.loadingProductos = ref(false)

        // Computados
        this.totalCompra = computed(() =>
            this.detalles.value.reduce((acc, d) => {
                const cantidad = Number(d.cantidad) || 0
                const precio = Number(d.precioUnitario) || 0
                return acc + (cantidad * precio)
            }, 0)
        )

        this.totalFormateado = computed(() =>
            new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP'
            }).format(this.totalCompra.value)
        )

        this.puedeRegistrar = computed(() => {
            return this.idProveedor.value &&
                this.productos.value.length > 0 &&
                this.detalles.value.some(d => d.idProducto && d.cantidad > 0 && d.precioUnitario > 0)
        })

        // Inicialización
        this.loadProveedores()
    }

    crearDetalleVacio() {
        return {
            idProducto: '',
            cantidad: 1,
            precioUnitario: 0
        }
    }

    async loadProveedores() {
        try {
            this.isLoading.value = true
            const proveedores = await proveedorService.getAllProveedores()
            this.proveedores.value = proveedores || []
            console.log('✅ Proveedores cargados:', this.proveedores.value.length)
        } catch (error) {
            console.error('❌ Error al cargar proveedores:', error)
            this.error.value = 'No se pudieron cargar los proveedores'
        } finally {
            this.isLoading.value = false
        }
    }

    /**
     * ✅ Cargar productos de un proveedor específico
     */
    async loadProductosByProveedor(idProveedor) {
        if (!idProveedor) {
            this.productos.value = []
            return
        }

        try {
            this.loadingProductos.value = true
            this.error.value = ''

            console.log('📡 Cargando productos del proveedor:', idProveedor)

            const result = await compraService.getProductosByProveedor(idProveedor)

            console.log('📥 Resultado:', result)

            if (result.success) {
                this.productos.value = result.data || []
                console.log(`✅ ${this.productos.value.length} productos cargados`)

                // Reiniciar detalles cuando cambia el proveedor
                this.detalles.value = [this.crearDetalleVacio()]

            } else {
                this.productos.value = []
                this.error.value = result.error || 'No se encontraron productos para este proveedor'
            }

        } catch (error) {
            console.error('❌ Error al cargar productos:', error)
            this.productos.value = []
            this.error.value = 'Error al cargar productos del proveedor'
        } finally {
            this.loadingProductos.value = false
        }
    }

    agregarDetalle() {
        this.detalles.value.push(this.crearDetalleVacio())
    }

    eliminarDetalle(index) {
        if (this.detalles.value.length > 1) {
            this.detalles.value.splice(index, 1)
        }
    }

    /**
     * Actualiza el precio unitario cuando se selecciona un producto
     */
    onProductoChange(index) {
        const detalle = this.detalles.value[index]
        const producto = this.productos.value.find(p => p.idProducto == detalle.idProducto)

        if (producto) {
            // Usar el precio de venta o compra del producto como sugerencia
            detalle.precioUnitario = producto.precioVenta || producto.precio || 0
            console.log(`📦 Producto seleccionado: ${producto.nombre}, Precio: ${detalle.precioUnitario}`)
        }
    }

    clearMessages() {
        this.error.value = ''
        this.successMessage.value = ''
    }

    clearForm() {
        this.idProveedor.value = null
        this.productos.value = []
        this.detalles.value = [this.crearDetalleVacio()]
        this.clearMessages()
    }

    validateForm() {
        const errors = []

        if (!this.idProveedor.value) {
            errors.push('Debe seleccionar un proveedor')
        }

        if (this.detalles.value.length === 0) {
            errors.push('Debe agregar al menos un producto')
        }

        const detallesValidos = this.detalles.value.filter(d => d.idProducto)

        if (detallesValidos.length === 0) {
            errors.push('Debe seleccionar al menos un producto')
        }

        detallesValidos.forEach((detalle, index) => {
            if (!detalle.idProducto) {
                errors.push(`Producto #${index + 1}: Debe seleccionar un producto`)
            }
            if (!detalle.cantidad || detalle.cantidad <= 0) {
                errors.push(`Producto #${index + 1}: La cantidad debe ser mayor a 0`)
            }
            if (!detalle.precioUnitario || detalle.precioUnitario <= 0) {
                errors.push(`Producto #${index + 1}: El precio debe ser mayor a 0`)
            }
        })

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    async executeCreate() {
        this.clearMessages()

        // Validar
        const validation = this.validateForm()
        if (!validation.isValid) {
            this.error.value = validation.errors[0]
            return { success: false, error: validation.errors[0] }
        }

        this.isLoading.value = true

        try {
            // Filtrar solo detalles con productos seleccionados
            const detallesValidos = this.detalles.value
                .filter(d => d.idProducto && d.cantidad > 0 && d.precioUnitario > 0)
                .map(d => ({
                    idProducto: Number(d.idProducto),
                    cantidad: Number(d.cantidad),
                    precioUnitario: Number(d.precioUnitario)
                }))

            const compraDTO = {
                idProveedor: Number(this.idProveedor.value),
                detalles: detallesValidos
            }

            console.log('📤 Enviando compra:', compraDTO)

            const result = await compraService.registrarCompra(compraDTO)

            if (result.success) {
                this.successMessage.value = result.message || 'Compra registrada exitosamente'
                setTimeout(() => this.clearForm(), 2000)
                return result
            } else {
                this.error.value = result.error
                return result
            }
        } catch (err) {
            console.error('❌ Error inesperado:', err)
            this.error.value = 'Error inesperado. Por favor intenta nuevamente.'
            return { success: false, error: this.error.value }
        } finally {
            this.isLoading.value = false
        }
    }
}