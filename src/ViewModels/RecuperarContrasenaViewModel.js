import { ref } from "vue";
import authService from "@/services/authService.js";

export class RecuperarContrasenaViewModel {
    constructor() {
        this.email = ref("");
        this.isLoading = ref(false);
        this.successMessage = ref("");
        this.error = ref("");
        this.hasError = ref(false);
    }

    async executeRecoverPassword() {
        this.isLoading.value = true;
        this.hasError.value = false;
        this.successMessage.value = "";
        this.error.value = "";

        try {
            // Aquí llamas al servicio que envía el correo
            const result = await authService.recoverPassword(this.email.value);

            if (result && result.success) {
                this.successMessage.value =
                    result.message ||
                    "Se ha enviado un enlace de recuperación a tu correo.";
            } else {
                this.hasError.value = true;
                this.error.value =
                    result?.error || "Correo no encontrado. Intenta nuevamente.";
            }
        } catch (err) {
            this.hasError.value = true;
            this.error.value = "Error al intentar recuperar la contraseña.";
        } finally {
            this.isLoading.value = false;
        }
    }
}