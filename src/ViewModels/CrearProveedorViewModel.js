import { ref, computed } from "vue";
import proveedorService from "../services/proveedorService.js";
import { ProveedorRegistro } from "../models/ProveedorRegistro";

export function useCrearProveedorViewModel() {
    const proveedor = ref(new ProveedorRegistro());

    const nombreDisponible = ref(true);
    const emailDisponible = ref(true);
    const nitDisponible = ref(true);
    const loading = ref(false);
    const mensaje = ref("");

    // Validaciones en tiempo real
    async function validarNombre() {
        if (proveedor.value.nombreCompania.length < 3) return;
        nombreDisponible.value = await proveedorService.checkNombreAvailable(proveedor.value.nombreCompania);
    }

    async function validarEmail() {
        if (!proveedor.value.email.includes("@")) return;
        emailDisponible.value = await proveedorService.checkEmailAvailable(proveedor.value.email);
    }

    async function validarNit() {
        if (proveedor.value.nitFiscal.length < 5) return;
        nitDisponible.value = await proveedorService.checkNitAvailable(proveedor.value.nitFiscal);
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
        if (!isFormValid.value) {
            mensaje.value = "Completa correctamente los campos obligatorios.";
            return;
        }

        try {
            loading.value = true;
            await proveedorService.createProveedor(proveedor.value);
            mensaje.value = "Proveedor creado correctamente";
            proveedor.value = new ProveedorRegistro();
        } catch (e) {
            mensaje.value = e;
        } finally {
            loading.value = false;
        }
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