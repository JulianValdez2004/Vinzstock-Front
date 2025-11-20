import { ref, computed } from "vue";
import proveedorService from "@/services/proveedorService"; // Ajusta si tu ruta es diferente

export function useCrearProveedorViewModel() {
    const proveedor = ref({
        nombreCompania: "",
        tipoIdentificacion: "",
        nitFiscal: "",
        email: "",
        numeroContacto: "",
        productoNombre: "",
        productoDescripcion: "",
        formaPago: "",
        fechaPedido: "",
    });

    const nombreDisponible = ref(true);
    const emailDisponible = ref(true);
    const nitDisponible = ref(true);
    const loading = ref(false);
    const mensaje = ref("");

    async function validarNombre() {
        if (!proveedor.value.nombreCompania) return;
        nombreDisponible.value = await proveedorService.checkNombreAvailable(
            proveedor.value.nombreCompania
        );
    }

    async function validarEmail() {
        if (!proveedor.value.email) return;
        emailDisponible.value = await proveedorService.checkEmailAvailable(
            proveedor.value.email
        );
    }

    async function validarNit() {
        if (!proveedor.value.nitFiscal) return;
        nitDisponible.value = await proveedorService.checkNitAvailable(
            proveedor.value.nitFiscal
        );
    }

    const isFormValid = computed(() => {
        return (
            proveedor.value.nombreCompania &&
            proveedor.value.tipoIdentificacion &&
            proveedor.value.nitFiscal &&
            proveedor.value.email &&
            proveedor.value.formaPago &&
            proveedor.value.fechaPedido &&
            nombreDisponible.value &&
            emailDisponible.value &&
            nitDisponible.value
        );
    });

    async function crearProveedor() {
        if (!isFormValid.value) return;

        loading.value = true;
        mensaje.value = "";

        try {
            await proveedorService.createProveedor(proveedor.value);
            mensaje.value = "Proveedor creado con éxito";
        } catch (err) {
            mensaje.value = "Error al crear el proveedor";
        } finally {
            loading.value = false;
        }

        //Limpiar formulario después de crear
        proveedor.value = {
            nombreCompania: "",
            tipoIdentificacion: "",
            nitFiscal: "",
            email: "",
            numeroContacto: "",
            productoNombre: "",
            productoDescripcion: "",
            formaPago: "",
            fechaPedido: "",
        };
    }

    return {
        proveedor,
        nombreDisponible,
        emailDisponible,
        nitDisponible,
        loading,
        mensaje,
        validarNombre,
        validarEmail,
        validarNit,
        isFormValid,
        crearProveedor,
    };
}