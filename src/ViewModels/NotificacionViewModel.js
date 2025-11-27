import { ref } from 'vue';
import notificacionService from '@/services/NotificacionService';

export default function useNotificacionViewModel() {
  const notificaciones = ref([]);
  const count = ref(0);
  const loading = ref(false);
  const showPanel = ref(false);
  let intervalId = null;

  const cargarNotificaciones = async () => {
    try {
      loading.value = true;
      count.value = await notificacionService.obtenerContadorNotificaciones();
      notificaciones.value = await notificacionService.obtenerNotificacionesInventarioBajo();
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      notificaciones.value = [];
      count.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const togglePanel = () => showPanel.value = !showPanel.value;
  const cerrarPanel = () => showPanel.value = false;

  const iniciarActualizacion = () => {
    cargarNotificaciones();
    intervalId = setInterval(cargarNotificaciones, 30000);
  };

  const detenerActualizacion = () => {
    if (intervalId) clearInterval(intervalId);
  };

  return {
    notificaciones,
    count,
    loading,
    showPanel,
    cargarNotificaciones,
    togglePanel,
    cerrarPanel,
    iniciarActualizacion,
    detenerActualizacion
  };
}