import { ref, computed, watch } from 'vue'
import productoService from '@/services/ProductoService'
import { ProductoRegistro } from '@/models/ProductoRegistro'


export class CrearProductoViewModel {
    constructor() {
        // Estado del formulario
        this.nombre = ref('')
        this.descripcion = ref('')
        this.precioVenta = ref(0)
        this.iva = ref(19) // IVA por defecto en Colombia

        // Estado de la operación
        this.error = ref('')
        this.successMessage = ref('')
        this.isLoading = ref(false)

        // Validación en tiempo real
        this.nombreError = ref('')
        this.isCheckingNombre = ref(false)

        // Watcher para validar nombre duplicado
        this.setupWatchers()

        // Computados
        this.isFormValid = computed(() => {
            return this.nombre.value.length >= 3 &&
                this.descripcion.value.length >= 10 &&
                this.precioVenta.value > 0 &&
                this.iva.value >= 0 &&
                this.iva.value <= 100 &&
                !this.nombreError.value
        })

        this.precioConIva = computed(() => {
            const precio = Number(this.precioVenta.value) || 0
            const ivaValor = precio * (Number(this.iva.value) / 100)
            return precio + ivaValor
        })

        this.precioFormateado = computed(() => {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP'
            }).format(this.precioConIva.value)
        })
    }

    setupWatchers() {
        // Validar nombre con debounce
        watch(this.nombre, async (newValue) => {
            if (!newValue || newValue.length < 3) {
                this.nombreError.value = ''
                return
            }

            this.isCheckingNombre.value = true
            this.nombreError.value = ''

            // Debounce
            await new Promise(resolve => setTimeout(resolve, 500))

            const result = await productoService.checkNombreAvailable(newValue)
            if (result.exists) {
                this.nombreError.value = 'Este nombre de producto ya existe'
            }
            this.isCheckingNombre.value = false
        })
    }

    clearMessages() {
        this.error.value = ''
        this.successMessage.value = ''
    }

    clearForm() {
        this.nombre.value = ''
        this.descripcion.value = ''
        this.precioVenta.value = 0
        this.iva.value = 19
        this.nombreError.value = ''
        this.clearMessages()
    }

    validateForm() {
        const productoRegistro = new ProductoRegistro({
            nombre: this.nombre.value,
            descripcion: this.descripcion.value,
            precioVenta: this.precioVenta.value,
            iva: this.iva.value
        })

        const validation = productoRegistro.validate()

        if (this.nombreError.value) {
            validation.isValid = false
            validation.errors.push(this.nombreError.value)
        }

        return validation
    }

    async executeCreate() {
        this.clearMessages()

        const validation = this.validateForm()
        if (!validation.isValid) {
            this.error.value = validation.errors[0]
            return { success: false, error: validation.errors[0] }
        }

        this.isLoading.value = true

        try {
            const productoRegistro = new ProductoRegistro({
                nombre: this.nombre.value,
                descripcion: this.descripcion.value,
                precioVenta: this.precioVenta.value,
                iva: this.iva.value
            })

            const result = await productoService.createProducto(productoRegistro)

            if (result.success) {
                this.successMessage.value = result.message

                setTimeout(() => {
                    this.clearForm()
                }, 2000)

                return result
            } else {
                this.error.value = result.error
                return result
            }
        } catch (err) {
            console.error('Error inesperado al crear producto:', err)
            this.error.value = 'Error inesperado. Por favor intenta nuevamente.'
            return { success: false, error: this.error.value }
        } finally {
            this.isLoading.value = false
        }
    }
}