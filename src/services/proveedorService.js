import api from "./api";

class ProveedorService {

    async createProveedor(proveedor) {
        try {
            const response = await api.post("/proveedores/crear", proveedor);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getAllProveedores() {
        try {
            const response = await api.get("/proveedores");
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getProveedorById(id) {
        try {
            const response = await api.get(`/proveedores/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateProveedor(id, proveedor) {
        try {
            const response = await api.put(`/proveedores/editar/${id}`, proveedor);
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
            const response = await api.get(`/proveedores/validar/nombre/${nombreCompania}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async checkEmailAvailable(email) {
        try {
            const response = await api.get(`/proveedores/validar/email/${email}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async checkNitAvailable(nitFiscal) {
        try {
            const response = await api.get(`/proveedores/validar/nit/${nitFiscal}`);
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