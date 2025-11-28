import api from './apiLogin'
import { Cliente } from '@/models/Cliente'

class ClienteService {
    /**
     * Crear un nuevo cliente
     */
    async createCliente(clienteRegistro) {
        try {
            const response = await api.post('/cliente/save', clienteRegistro.toJSON())
            
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    data: Cliente.fromResponse(response.data.data)
                }
            }
            
            return {
                success: false,
                error: response.data.message || 'Error al crear el cliente'
            }
        } catch (error) {
            console.error('Error en createCliente:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Error al crear el cliente'
            }
        }
    }

    /**
     * Obtener todos los clientes
     */
    async getAllClientes() {
        try {
            const response = await api.get('/clientes/all')
            
            if (response.data.success) {
                return {
                    success: true,
                    data: Cliente.fromResponseList(response.data.data),
                    total: response.data.total
                }
            }
            
            return {
                success: false,
                error: response.data.message || 'Error al obtener clientes'
            }
        } catch (error) {
            console.error('Error en getAllClientes:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener clientes'
            }
        }
    }

    /**
     * Obtener cliente por ID
     */
    async getClienteById(id) {
        try {
            const response = await api.get(`/cliente/${id}`)
            
            if (response.data.success) {
                return {
                    success: true,
                    data: Cliente.fromResponse(response.data.data)
                }
            }
            
            return {
                success: false,
                error: response.data.message || 'Cliente no encontrado'
            }
        } catch (error) {
            console.error('Error en getClienteById:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Cliente no encontrado'
            }
        }
    }

    /**
     * Buscar clientes por nombre
     */
    async searchByNombre(nombre) {
        try {
            const response = await api.get('/cliente/search', {
                params: { nombre }
            })
            
            if (response.data.success) {
                return {
                    success: true,
                    data: Cliente.fromResponseList(response.data.data),
                    total: response.data.total
                }
            }
            
            return {
                success: false,
                error: response.data.message || 'Error al buscar clientes'
            }
        } catch (error) {
            console.error('Error en searchByNombre:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Error al buscar clientes'
            }
        }
    }

    /**
     * Buscar cliente por número de documento
     */
    async getByDocumento(numeroDocumento) {
        try {
            const response = await api.get(`/cliente/documento/${numeroDocumento}`)
            
            if (response.data.success) {
                return {
                    success: true,
                    data: Cliente.fromResponse(response.data.data)
                }
            }
            
            return {
                success: false,
                error: response.data.message || 'Cliente no encontrado'
            }
        } catch (error) {
            console.error('Error en getByDocumento:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Cliente no encontrado'
            }
        }
    }

    /**
     * Obtener clientes activos
     */
    async getClientesActivos() {
        try {
            const response = await api.get('/clientes/activos')
            
            if (response.data.success) {
                return {
                    success: true,
                    data: Cliente.fromResponseList(response.data.data),
                    total: response.data.total
                }
            }
            
            return {
                success: false,
                error: response.data.message || 'Error al obtener clientes activos'
            }
        } catch (error) {
            console.error('Error en getClientesActivos:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener clientes activos'
            }
        }
    }

    /**
     * Verificar si existe un cliente por documento
     */
    async existsByDocumento(numeroDocumento) {
        try {
            const response = await api.get(`/cliente/existe/${numeroDocumento}`)
            
            if (response.data.success) {
                return {
                    success: true,
                    existe: response.data.existe
                }
            }
            
            return {
                success: false,
                error: response.data.message || 'Error al verificar cliente'
            }
        } catch (error) {
            console.error('Error en existsByDocumento:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Error al verificar cliente'
            }
        }
    }
}

export default new ClienteService()