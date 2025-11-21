import api from './apiLogin'

class CompraService {
    /**
     * Registrar una nueva compra
     */
    async registrarCompra(compraDTO) {
        try {
            console.log('📤 Enviando compra:', compraDTO)
            const response = await api.post('/compras/registrar', compraDTO)

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message || 'Compra registrada correctamente',
                    data: response.data.data
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
     * ✅ Obtener productos de un proveedor
     */
    async getProductosByProveedor(idProveedor) {
        try {
            console.log('📡 Obteniendo productos del proveedor:', idProveedor)
            const response = await api.get(`/productos/proveedor/${idProveedor}`)

            console.log('📥 Respuesta:', response.data)

            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data || [],
                    total: response.data.total || 0
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al obtener productos',
                    data: []
                }
            }
        } catch (error) {
            console.error('❌ Error al obtener productos:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener productos del proveedor',
                data: []
            }
        }
    }

    /**
     * Obtener todas las compras
     */
    async getAllCompras() {
        try {
            const response = await api.get('/compras/all')

            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data || []
                }
            }
            return { success: false, data: [] }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Obtener compra por ID con detalles
     */
    async getCompraById(idCompra) {
        try {
            const response = await api.get(`/compras/${idCompra}`)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Manejo de errores
     */
    handleError(error) {
        console.error('❌ Error en CompraService:', error)

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
