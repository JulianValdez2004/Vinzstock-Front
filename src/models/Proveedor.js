class Proveedor {
    constructor(data = {}) {
        this.idProveedor = data.idProveedor || null;
        this.nombre = data.nombre || '';
        this.nitFiscal = data.nitFiscal || '';
        this.telefono = data.telefono || '';
        this.email = data.email || '';
    }

    // Validaciones
    validarNombre() {
        if (!this.nombre || this.nombre.trim().length === 0) {
            return { valido: false, mensaje: 'El nombre de la compañía es obligatorio' };
        }
        if (this.nombre.length < 3) {
            return { valido: false, mensaje: 'El nombre debe tener al menos 3 caracteres' };
        }
        if (this.nombre.length > 100) {
            return { valido: false, mensaje: 'El nombre no puede exceder 100 caracteres' };
        }
        return { valido: true, mensaje: '' };
    }

    validarNitFiscal() {
        if (!this.nitFiscal || this.nitFiscal.trim().length === 0) {
            return { valido: false, mensaje: 'El NIT fiscal es obligatorio' };
        }
        // Validar formato NIT (números y guión)
        const nitRegex = /^[0-9]{9}-[0-9]$/;
        if (!nitRegex.test(this.nitFiscal)) {
            return { valido: false, mensaje: 'Formato de NIT inválido (ej: 123456789-0)' };
        }
        return { valido: true, mensaje: '' };
    }

    validarTelefono() {
        if (this.telefono && this.telefono.trim().length > 0) {
            // Validar formato de teléfono (10 dígitos)
            const telefonoRegex = /^[0-9]{10}$/;
            if (!telefonoRegex.test(this.telefono)) {
                return { valido: false, mensaje: 'El teléfono debe tener 10 dígitos' };
            }
        }
        return { valido: true, mensaje: '' };
    }

    validarEmail() {
        if (!this.email || this.email.trim().length === 0) {
            return { valido: false, mensaje: 'El email es obligatorio' };
        }
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            return { valido: false, mensaje: 'Formato de email inválido' };
        }
        return { valido: true, mensaje: '' };
    }

    // Validar todos los campos
    validar() {
        const errores = [];

        const validacionNombre = this.validarNombre();
        if (!validacionNombre.valido) errores.push(validacionNombre.mensaje);

        const validacionNit = this.validarNitFiscal();
        if (!validacionNit.valido) errores.push(validacionNit.mensaje);

        const validacionTelefono = this.validarTelefono();
        if (!validacionTelefono.valido) errores.push(validacionTelefono.mensaje);

        const validacionEmail = this.validarEmail();
        if (!validacionEmail.valido) errores.push(validacionEmail.mensaje);

        return {
            valido: errores.length === 0,
            errores: errores
        };
    }

    // Convertir a objeto plano para enviar al backend
    toJSON() {
        return {
            idProveedor: this.idProveedor,
            nombre: this.nombre.trim(),
            nitFiscal: this.nitFiscal.trim(),
            telefono: this.telefono.trim(),
            email: this.email.trim().toLowerCase()
        };
    }

    // Crear instancia desde respuesta del backend
    static fromJSON(json) {
        return new Proveedor(json);
    }

    // Limpiar el modelo
    limpiar() {
        this.idProveedor = null;
        this.nombre = '';
        this.nitFiscal = '';
        this.telefono = '';
        this.email = '';
    }
}

export default Proveedor;