import { ref, computed } from 'vue';
import Proveedor from '../models/Proveedor';
import api from '../services/apiLogin';

export function useCrearProveedorViewModel() {
    // Estado reactivo
    const proveedor = ref(new Proveedor());
    const cargando = ref(false);
    const errores = ref([]);
    const mensaje = ref('');
    const exitoRegistro = ref(false);

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
        return formularioValido.value && !cargando.value;
    });

    // Validación en tiempo real por campo
    const validarNombre = () => {
        const resultado = proveedor.value.validarNombre();
        erroresNombre.value = resultado.valido ? '' : resultado.mensaje;
        return resultado.valido;
    };

    const validarNit = () => {
        const resultado = proveedor.value.validarNitFiscal();
        erroresNit.value = resultado.valido ? '' : resultado.mensaje;
        return resultado.valido;
    };

    const validarTelefono = () => {
        const resultado = proveedor.value.validarTelefono();
        erroresTelefono.value = resultado.valido ? '' : resultado.mensaje;
        return resultado.valido;
    };

    const validarEmail = () => {
        const resultado = proveedor.value.validarEmail();
        erroresEmail.value = resultado.valido ? '' : resultado.mensaje;
        return resultado.valido;
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

    // Limpiar formulario completo
    const limpiarFormulario = () => {
        proveedor.value = new Proveedor();
        limpiarErrores();
        mensaje.value = '';
        exitoRegistro.value = false;
    };

    // Validar formulario completo
    const validarFormulario = () => {
        const validacion = proveedor.value.validar();

        if (!validacion.valido) {
            // Validar cada campo para mostrar errores individuales
            validarNombre();
            validarNit();
            validarTelefono();
            validarEmail();

            errores.value = validacion.errores;
            return false;
        }

        limpiarErrores();
        return true;
    };

    // Verificar si el NIT ya existe
    const verificarNitExistente = async (nit) => {
        try {
            const response = await api.get('/proveedores/all');
            const proveedores = response.data;

            return proveedores.some(p => p.nitFiscal === nit);
        } catch (error) {
            console.error('Error al verificar NIT:', error);
            return false;
        }
    };

    // Verificar si el email ya existe
    const verificarEmailExistente = async (email) => {
        try {
            const response = await api.get('/proveedores/all');
            const proveedores = response.data;

            return proveedores.some(p => p.email.toLowerCase() === email.toLowerCase());
        } catch (error) {
            console.error('Error al verificar email:', error);
            return false;
        }
    };

    // Crear proveedor
    const crearProveedor = async () => {
        try {
            // Validar formulario
            if (!validarFormulario()) {
                return {
                    success: false,
                    message: 'Por favor corrige los errores del formulario'
                };
            }

            cargando.value = true;
            errores.value = [];
            mensaje.value = '';
            exitoRegistro.value = false;

            // Verificar duplicados
            const nitExiste = await verificarNitExistente(proveedor.value.nitFiscal);
            if (nitExiste) {
                erroresNit.value = 'Este NIT ya está registrado';
                errores.value = ['El NIT fiscal ya está registrado en el sistema'];
                return {
                    success: false,
                    message: 'El NIT fiscal ya está registrado'
                };
            }

            const emailExiste = await verificarEmailExistente(proveedor.value.email);
            if (emailExiste) {
                erroresEmail.value = 'Este email ya está registrado';
                errores.value = ['El email ya está registrado en el sistema'];
                return {
                    success: false,
                    message: 'El email ya está registrado'
                };
            }

            // Realizar petición al backend
            const response = await api.post(
                '/proveedor/save',
                proveedor.value.toJSON()
            );

            if (response.data.success) {
                mensaje.value = response.data.message || 'Proveedor creado exitosamente';
                exitoRegistro.value = true;

                // Limpiar formulario después de 2 segundos
                setTimeout(() => {
                    limpiarFormulario();
                }, 2000);

                return {
                    success: true,
                    message: response.data.message,
                    data: response.data.data
                };
            }

            return {
                success: false,
                message: 'Error al crear el proveedor'
            };

        } catch (error) {
            console.error('Error al crear proveedor:', error);

            const mensajeError = error.response?.data?.message ||
                error.message ||
                'Error al crear el proveedor';

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

    // Resetear el estado de éxito
    const resetearExito = () => {
        exitoRegistro.value = false;
        mensaje.value = '';
    };

    // Cargar datos desde un objeto (útil para prellenar)
    const cargarDatos = (datos) => {
        proveedor.value = new Proveedor(datos);
        limpiarErrores();
    };

    return {
        // Estado
        proveedor,
        cargando,
        errores,
        mensaje,
        exitoRegistro,

        // Errores por campo
        erroresNombre,
        erroresNit,
        erroresTelefono,
        erroresEmail,

        // Computed
        formularioValido,
        puedeGuardar,

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
        limpiarFormulario,
        resetearExito,

        // Métodos de negocio
        crearProveedor,
        verificarNitExistente,
        verificarEmailExistente,
        cargarDatos
    };
}