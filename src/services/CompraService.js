import api from './apiLogin'

class CompraService {
    /**
     * Registrar una nueva compra
     */
    async registrarCompra(compraDTO) {
        try {
            const response = await api.post('/compras/registrar', compraDTO)

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message || 'Compra registrada correctamente'
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al registrar la compra'
                }
            }
        } catch (error) {
            return this.handleError(error)
        }
    }
    /**
     * Manejo de errores
     */
    handleError(error) {
        console.error('Error en compraService:', error)

        if (error.response?.data) {
            let errorMessage = 'Error al procesar la solicitud'

            if (error.response.data.message) {
                errorMessage = error.response.data.message
            } else if (typeof error.response.data === 'string') {
                errorMessage = error.response.data
            } else if (error.response.data.error) {
                errorMessage = error.response.data.error
            }

            return {
                success: false,
                error: errorMessage
            }
        } else if (error.request) {
            return {
                success: false,
                error: 'No se pudo conectar con el servidor'
            }
        } else {
            return {
                success: false,
                error: 'Error inesperado'
            }
        }
    }
}

export default new CompraService()
