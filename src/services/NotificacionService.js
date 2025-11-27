
import api from './apiLogin';


async function obtenerNotificacionesInventarioBajo() {
    try {
        const response = await api.get(`/inventario-bajo`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        throw error;
    }
}

async function obtenerContadorNotificaciones() {
    try {
        const response = await api.get(`/inventario-bajo/count`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener contador:', error);
        throw error;
    }
}

export default {
    obtenerNotificacionesInventarioBajo,
    obtenerContadorNotificaciones
};