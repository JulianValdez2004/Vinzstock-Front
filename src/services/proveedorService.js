import api from "./apiLogin";
import { ProveedorRegistro } from '@/models/ProveedorRegistro'

class ProveedorService {

    async createProveedor(proveedor) {
        try {
            const response = await api.post("/proveedor/save", proveedor); // /proveedor/save
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getAllProveedores() {
        try {
            const response = await api.get("/proveedores/all"); // /proveedores/all
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getProveedorById(id) {
        try {
            const response = await api.get(`/proveedor/${id}`); // /proveedor/{id}
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateProveedor(proveedor) {
        try {
            const response = await api.put(`/proveedor/update`, proveedor); // /proveedor/update
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /*
    async deleteProveedor(id) {
        try {
            const response = await api.delete(`/proveedores/eliminar/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    */

    // Validaciones individuales
    async checkNombreAvailable(nombreCompania) {
        try {
            const response = await api.get(`/proveedor/validar/nombre/${nombreCompania}`); // /proveedor/validar/nombre/{nombre}
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async checkEmailAvailable(email) {
        try {
            const response = await api.get(`/proveedor/validar/email/${email}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async checkNitAvailable(nitFiscal) {
        try {
            const response = await api.get(`/proveedor/validar/nit/${nitFiscal}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        return error.response?.data?.message || "Error inesperado del servidor.";
    }
}

export default new ProveedorService();