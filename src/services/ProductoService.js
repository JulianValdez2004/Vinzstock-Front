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
            const response = await api.get('/producto/all')
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
            return {
                success: true,
                message: response.data.message || 'Producto eliminado exitosamente'
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
            const response = await api.get('/producto/all')
            const productos = response.data
            const exists = productos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())
            return { available: !exists, exists }
        } catch (error) {
            console.error('Error al verificar nombre:', error)
            return { available: true, exists: false }
        }
    }

    /**
     * Maneja los errores
     */
    handleError(error) {
        console.error('Error en productoService:', error)

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

export default new ProductoService()