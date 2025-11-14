import api from './apiLogin'
import { ProductoRegistro } from '@/models/ProductoRegistro'

class ProductoService {
    /**
     * Crear un nuevo producto
     */
    async createProducto(productoRegistro) {
        try {
            const response = await api.post('/producto/save', productoRegistro.toJSON())

            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || 'Producto creado exitosamente'
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al crear producto'
                }
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Obtener todos los productos
     */
    async getAllProductos() {
        try {
            const response = await api.get('/productos/all')
            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Obtener producto por ID
     */
    async getProductoById(id) {
        try {
            const response = await api.get(`/producto/${id}`)
            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Actualizar producto
     */
    async updateProducto(producto) {
        try {
            const response = await api.put('/producto/update', producto)

            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || 'Producto actualizado exitosamente'
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al actualizar producto'
                }
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Eliminar producto
     */
    async deleteProducto(id) {
        try {
            const response = await api.delete(`/producto/delete/${id}`)

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message || 'Producto eliminado exitosamente'
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al eliminar producto'
                }
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Buscar productos por nombre
     */
    async searchByNombre(nombre) {
        try {
            const response = await api.get('/producto/search', {
                params: { nombre }
            })
            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Verificar si un producto ya existe por nombre
     */
    async checkNombreAvailable(nombre) {
        try {
            const response = await api.get('/productos/all')
            const productos = response.data

            // Comparar ignorando mayúsculas/minúsculas y espacios
            const nombreNormalizado = nombre.trim().toLowerCase()
            const exists = productos.some(p =>
                p.nombre.trim().toLowerCase() === nombreNormalizado
            )

            return { available: !exists, exists }
        } catch (error) {
            console.error('Error al verificar nombre:', error)
            // En caso de error, permitir continuar (el backend validará)
            return { available: true, exists: false }
        }
    }

    /**
     * Obtener productos con bajo stock (opcional, para futuro)
     */
    async getProductosBajoStock(cantidad = 10) {
        try {
            const response = await api.get('/productos/bajo-stock', {
                params: { cantidad }
            })
            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Obtener estadísticas de productos (opcional, para futuro)
     */
    async getEstadisticas() {
        try {
            const response = await api.get('/productos/estadisticas')
            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Maneja los errores de las peticiones
     */
    handleError(error) {
        console.error('Error en productoService:', error)

        if (error.response?.data) {
            let errorMessage = 'Error al procesar la solicitud'

            // El backend devuelve { success: false, message: "..." }
            if (error.response.data.message) {
                errorMessage = error.response.data.message
            }
            // Por si devuelve solo un string
            else if (typeof error.response.data === 'string') {
                errorMessage = error.response.data
            }
            // Por si usa "error" en lugar de "message"
            else if (error.response.data.error) {
                errorMessage = error.response.data.error
            }

            return {
                success: false,
                error: errorMessage
            }
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta
            return {
                success: false,
                error: 'No se pudo conectar con el servidor'
            }
        } else {
            // Error al configurar la petición
            return {
                success: false,
                error: 'Error inesperado'
            }
        }
    }
}

export default new ProductoService()