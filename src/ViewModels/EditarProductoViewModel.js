import { ref, computed } from 'vue'
import productoService from '@/services/productoService'

export class EditarProductoViewModel {
    constructor() {
        this.idProducto = ref(null)
        this.nombre = ref('')
        this.descripcion = ref('')
        this.precioVenta = ref(0)
        this.iva = ref(19)

        this.error = ref('')
        this.successMessage = ref('')
        this.isLoading = ref(false)

        this.isFormValid = computed(() => {
            return this.nombre.value.length >= 3 &&
                this.descripcion.value.length >= 10 &&
                this.precioVenta.value > 0 &&
                this.iva.value >= 0 &&
                this.iva.value <= 100
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

    loadProducto(producto) {
        this.idProducto.value = producto.idProducto
        this.nombre.value = producto.nombre
        this.descripcion.value = producto.descripcion
        this.precioVenta.value = producto.precioVenta
        this.iva.value = producto.iva
    }

    clearMessages() {
        this.error.value = ''
        this.successMessage.value = ''
    }

    async executeUpdate() {
        this.clearMessages()

        if (!this.isFormValid.value) {
            this.error.value = 'Por favor completa todos los campos correctamente'
            return { success: false }
        }

        this.isLoading.value = true

        try {
            const productoActualizado = {
                idProducto: this.idProducto.value,
                nombre: this.nombre.value,
                descripcion: this.descripcion.value,
                precioVenta: Number(this.precioVenta.value),
                iva: Number(this.iva.value)
            }

            const result = await productoService.updateProducto(productoActualizado)

            if (result.success) {
                this.successMessage.value = result.message
                return result
            } else {
                this.error.value = result.error
                return result
            }
        } catch (err) {
            console.error('Error al actualizar producto:', err)
            this.error.value = 'Error inesperado'
            return { success: false }
        } finally {
            this.isLoading.value = false
        }
    }
}