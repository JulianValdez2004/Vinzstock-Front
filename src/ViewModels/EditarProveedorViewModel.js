// src/ViewModels/EditarProveedorViewModel.js
import { ref, computed, onMounted } from 'vue';
import Proveedor from '../models/Proveedor';
import api from '../services/apiLogin';
import { useRouter } from 'vue-router';

export function useEditarProveedorViewModel(proveedorId) {
    const router = useRouter();

    // Estado reactivo
    const proveedor = ref(new Proveedor());
    const proveedorOriginal = ref(null); // Guardamos los datos originales
    const cargando = ref(false);
    const cargandoDatos = ref(true);
    const errores = ref([]);
    const mensaje = ref('');
    const exitoActualizacion = ref(false);

    // Estados de validación individual por campo
    const erroresNombre = ref('');
    const erroresNit = ref('');
    const erroresTelefono = ref('');
    const erroresEmail = ref('');

    // Computed properties
    const formularioValido = computed(() => {
        const validacion = proveedor.value.validar();
        return validacion.valido;
    });

    const puedeGuardar = computed(() => {
        return formularioValido.value && !cargando.value && hayCambios.value;
    });

    // Detectar si hay cambios en el formulario
    const hayCambios = computed(() => {
        if (!proveedorOriginal.value) return false;

        return proveedor.value.nombre !== proveedorOriginal.value.nombre ||
            proveedor.value.nitFiscal !== proveedorOriginal.value.nitFiscal ||
            proveedor.value.email !== proveedorOriginal.value.email ||
            proveedor.value.telefono !== proveedorOriginal.value.telefono;
    });

    // Validación en tiempo real por campo
    const validarNombre = () => {
        const resultado = proveedor.value.validarNombre();
        erroresNombre.value = resultado.valido ? '' : resultado.mensaje;
        return resultado.valido;
    };

    const validarNit = async () => {
        const resultado = proveedor.value.validarNitFiscal();

        if (!resultado.valido) {
            erroresNit.value = resultado.mensaje;
            return false;
        }

        // Solo verificar duplicados si cambió el NIT
        if (proveedor.value.nitFiscal !== proveedorOriginal.value?.nitFiscal) {
            const existe = await verificarNitExistente(proveedor.value.nitFiscal);
            if (existe) {
                erroresNit.value = 'Este NIT ya está registrado con otro proveedor';
                return false;
            }
        }

        erroresNit.value = '';
        return true;
    };

    const validarTelefono = () => {
        const resultado = proveedor.value.validarTelefono();
        erroresTelefono.value = resultado.valido ? '' : resultado.mensaje;
        return resultado.valido;
    };

    const validarEmail = async () => {
        const resultado = proveedor.value.validarEmail();

        if (!resultado.valido) {
            erroresEmail.value = resultado.mensaje;
            return false;
        }

        // Solo verificar duplicados si cambió el email
        if (proveedor.value.email !== proveedorOriginal.value?.email) {
            const existe = await verificarEmailExistente(proveedor.value.email);
            if (existe) {
                erroresEmail.value = 'Este email ya está registrado con otro proveedor';
                return false;
            }
        }

        erroresEmail.value = '';
        return true;
    };

    const validarCampo = (campo) => {
        switch(campo) {
            case 'nombre':
                return validarNombre();
            case 'nitFiscal':
                return validarNit();
            case 'telefono':
                return validarTelefono();
            case 'email':
                return validarEmail();
            default:
                return true;
        }
    };

    // Limpiar errores de un campo específico
    const limpiarErrorCampo = (campo) => {
        switch(campo) {
            case 'nombre':
                erroresNombre.value = '';
                break;
            case 'nitFiscal':
                erroresNit.value = '';
                break;
            case 'telefono':
                erroresTelefono.value = '';
                break;
            case 'email':
                erroresEmail.value = '';
                break;
        }
    };

    // Limpiar todos los errores
    const limpiarErrores = () => {
        errores.value = [];
        erroresNombre.value = '';
        erroresNit.value = '';
        erroresTelefono.value = '';
        erroresEmail.value = '';
    };

    // Validar formulario completo
    const validarFormulario = async () => {
        const validacion = proveedor.value.validar();

        if (!validacion.valido) {
            await validarNombre();
            await validarNit();
            await validarTelefono();
            await validarEmail();

            errores.value = validacion.errores;
            return false;
        }

        limpiarErrores();
        return true;
    };

    // Verificar si el NIT ya existe (excluyendo el actual)
    const verificarNitExistente = async (nit) => {
        try {
            const response = await api.get('/proveedores/all');
            const proveedores = response.data;

            return proveedores.some(p =>
                p.nitFiscal === nit &&
                p.id !== proveedorOriginal.value?.id
            );
        } catch (error) {
            console.error('Error al verificar NIT:', error);
            return false;
        }
    };

    // Verificar si el email ya existe (excluyendo el actual)
    const verificarEmailExistente = async (email) => {
        try {
            const response = await api.get('/proveedores/all');
            const proveedores = response.data;

            return proveedores.some(p =>
                p.email.toLowerCase() === email.toLowerCase() &&
                p.id !== proveedorOriginal.value?.id
            );
        } catch (error) {
            console.error('Error al verificar email:', error);
            return false;
        }
    };

    // Cargar datos del proveedor
    const cargarProveedor = async (id) => {
        try {
            cargandoDatos.value = true;
            limpiarErrores();

            const response = await api.get(`/proveedor/${id}`);

            if (response.data) {
                // Guardar datos originales
                proveedorOriginal.value = { ...response.data };

                // Cargar en el modelo
                proveedor.value = new Proveedor(response.data);

                return {
                    success: true,
                    data: response.data
                };
            }

            throw new Error('No se encontró el proveedor');

        } catch (error) {
            console.error('Error al cargar proveedor:', error);

            const mensajeError = error.response?.data?.message ||
                error.message ||
                'Error al cargar los datos del proveedor';

            errores.value = [mensajeError];

            return {
                success: false,
                message: mensajeError
            };
        } finally {
            cargandoDatos.value = false;
        }
    };

    // Actualizar proveedor
    const actualizarProveedor = async () => {
        try {
            // Validar formulario
            const esValido = await validarFormulario();
            if (!esValido) {
                return {
                    success: false,
                    message: 'Por favor corrige los errores del formulario'
                };
            }

            // Verificar que hay cambios
            if (!hayCambios.value) {
                errores.value = ['No hay cambios para guardar'];
                return {
                    success: false,
                    message: 'No hay cambios para guardar'
                };
            }

            cargando.value = true;
            errores.value = [];
            mensaje.value = '';
            exitoActualizacion.value = false;

            // Preparar datos para enviar (incluir el ID)
            const datosActualizados = {
                id: proveedorOriginal.value.id,
                ...proveedor.value.toJSON()
            };

            // Realizar petición al backend
            const response = await api.put(
                '/proveedor/update',
                datosActualizados
            );

            if (response.data.success) {
                mensaje.value = response.data.message || 'Proveedor actualizado exitosamente';
                exitoActualizacion.value = true;

                // Actualizar datos originales
                proveedorOriginal.value = { ...datosActualizados };

                return {
                    success: true,
                    message: response.data.message,
                    data: response.data.data
                };
            }

            return {
                success: false,
                message: 'Error al actualizar el proveedor'
            };

        } catch (error) {
            console.error('Error al actualizar proveedor:', error);

            const mensajeError = error.response?.data?.message ||
                error.message ||
                'Error al actualizar el proveedor';

            errores.value = [mensajeError];
            mensaje.value = '';

            return {
                success: false,
                message: mensajeError
            };
        } finally {
            cargando.value = false;
        }
    };

    // Resetear formulario a los valores originales
    const resetearCambios = () => {
        if (proveedorOriginal.value) {
            proveedor.value = new Proveedor(proveedorOriginal.value);
            limpiarErrores();
            mensaje.value = '';
            exitoActualizacion.value = false;
        }
    };

    // Cargar datos al montar el componente
    onMounted(async () => {
        if (proveedorId) {
            const resultado = await cargarProveedor(proveedorId);

            if (!resultado.success) {
                // Si falla, redirigir a la lista
                setTimeout(() => {
                    router.push('/admin/proveedores');
                }, 2000);
            }
        }
    });

    return {
        // Estado
        proveedor,
        proveedorOriginal,
        cargando,
        cargandoDatos,
        errores,
        mensaje,
        exitoActualizacion,

        // Errores por campo
        erroresNombre,
        erroresNit,
        erroresTelefono,
        erroresEmail,

        // Computed
        formularioValido,
        puedeGuardar,
        hayCambios,

        // Métodos de validación
        validarCampo,
        validarNombre,
        validarNit,
        validarTelefono,
        validarEmail,
        validarFormulario,

        // Métodos de limpieza
        limpiarErrorCampo,
        limpiarErrores,
        resetearCambios,

        // Métodos de negocio
        cargarProveedor,
        actualizarProveedor,
        verificarNitExistente,
        verificarEmailExistente
    };
}