// src/ViewModels/CrearClienteViewModel.js
import { ref, computed } from 'vue'
import clienteService from '@/services/clienteService'
import { ClienteRegistro } from '@/models/ClienteRegistro'

export class CrearClienteViewModel {
    constructor() {
        // Estado del formulario
        this.nombreRazonSocial = ref('')
        this.numeroDocumento = ref('')
        this.estado = ref(true)

        // Estado de la operación
        this.error = ref('')
        this.successMessage = ref('')
        this.isLoading = ref(false)

        // Computados
        this.isFormValid = computed(() => {
            return this.nombreRazonSocial.value.trim().length >= 3 &&
                this.numeroDocumento.value.trim().length >= 6
        })

        this.tipoDocumentoDetectado = computed(() => {
            const cliente = new ClienteRegistro({
                nombreRazonSocial: this.nombreRazonSocial.value,
                numeroDocumento: this.numeroDocumento.value
            })
            return cliente.getTipoDocumento()
        })
    }

    /**
     * Limpiar mensajes
     */
    clearMessages() {
        this.error.value = ''
        this.successMessage.value = ''
    }

    /**
     * Limpiar formulario
     */
    clearForm() {
        this.nombreRazonSocial.value = ''
        this.numeroDocumento.value = ''
        this.estado.value = true
        this.clearMessages()
    }

    /**
     * Formatear input del documento (solo números y guión)
     */
    formatearInputDocumento() {
        const cliente = new ClienteRegistro()
        this.numeroDocumento.value = cliente.formatearInput(this.numeroDocumento.value)
    }

    /**
     * Obtener hint para el documento
     */
    getDocumentoHint() {
        const numero = this.numeroDocumento.value
        if (!numero) return 'Ingrese CC (6-12 dígitos) o NIT (123456789-0)'
        
        const tipo = this.tipoDocumentoDetectado.value
        
        if (tipo === 'CC') {
            return `✓ Formato CC válido (${numero.length} dígitos)`
        } else if (tipo === 'NIT') {
            return '✓ Formato NIT válido'
        } else if (numero.length > 0) {
            return 'Use CC (6-12 dígitos) o NIT (123456789-0)'
        }
        
        return ''
    }

    /**
     * Validar formulario
     */
    validateForm() {
        const clienteRegistro = new ClienteRegistro({
            nombreRazonSocial: this.nombreRazonSocial.value,
            numeroDocumento: this.numeroDocumento.value,
            estado: this.estado.value
        })

        return clienteRegistro.validate()
    }

    /**
     * Ejecutar creación de cliente
     */
    async executeCreate() {
        this.clearMessages()

        // Validar datos
        const validation = this.validateForm()
        if (!validation.isValid) {
            this.error.value = validation.errors[0]
            return { success: false, error: validation.errors[0] }
        }

        this.isLoading.value = true

        try {
            // Crear objeto de registro
            const clienteRegistro = new ClienteRegistro({
                nombreRazonSocial: this.nombreRazonSocial.value,
                numeroDocumento: this.numeroDocumento.value,
                estado: this.estado.value
            })

            const result = await clienteService.createCliente(clienteRegistro)

            if (result.success) {
                this.successMessage.value = result.message

                // Limpiar formulario después de un delay
                setTimeout(() => {
                    this.clearForm()
                }, 2000)

                return result
            } else {
                this.error.value = result.error
                return result
            }
        } catch (err) {
            console.error('Error inesperado al crear cliente:', err)
            this.error.value = 'Error inesperado. Por favor intenta nuevamente.'
            return { success: false, error: this.error.value }
        } finally {
            this.isLoading.value = false
        }
    }
}