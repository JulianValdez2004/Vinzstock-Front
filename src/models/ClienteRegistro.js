 /*
 * Modelo para registrar un nuevo cliente
 */
export class ClienteRegistro {
    constructor(data = {}) {
        this.nombreRazonSocial = data.nombreRazonSocial || ''
        this.numeroDocumento = data.numeroDocumento || ''
        this.estado = data.estado !== undefined ? data.estado : true
    }

    /**
     * Valida los datos del cliente
     */
    validate() {
        const errors = []

        // Validar nombre o razón social
        if (!this.nombreRazonSocial || this.nombreRazonSocial.trim() === '') {
            errors.push('El nombre o razón social es obligatorio')
        } else if (this.nombreRazonSocial.length > 100) {
            errors.push('El nombre no puede exceder 100 caracteres')
        } else if (!this.isValidNombre(this.nombreRazonSocial)) {
            errors.push('El nombre contiene caracteres no permitidos')
        }

        // Validar número de documento
        if (!this.numeroDocumento || this.numeroDocumento.trim() === '') {
            errors.push('El número de documento es obligatorio')
        } else {
            const validacionDoc = this.validateNumeroDocumento()
            if (!validacionDoc.isValid) {
                errors.push(validacionDoc.error)
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    /**
     * Valida el formato del nombre (sin caracteres especiales)
     */
    isValidNombre(nombre) {
        // Solo letras, números, espacios, punto, coma, apóstrofe y guión
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,'-]+$/
        return regex.test(nombre)
    }

    /**
     * Valida el número de documento (CC o NIT)
     */
    validateNumeroDocumento() {
        const numero = this.numeroDocumento.trim()

        // Formato 1: CC - Solo números entre 6 y 12 dígitos
        const regexCC = /^\d{6,12}$/
        const esCC = regexCC.test(numero)

        // Formato 2: NIT - 9 dígitos, guión, 1 dígito
        const regexNIT = /^\d{9}-\d{1}$/
        const esNIT = regexNIT.test(numero)

        if (!esCC && !esNIT) {
            return {
                isValid: false,
                error: 'Formato inválido. Use CC (6-12 dígitos) o NIT (123456789-0)'
            }
        }

        // Si es NIT, validar dígito verificador
        if (esNIT) {
            const validacionNIT = this.validarDigitoVerificadorNIT(numero)
            if (!validacionNIT.isValid) {
                return validacionNIT
            }
        }

        return { isValid: true, error: null }
    }

    /**
     * Valida el dígito verificador del NIT colombiano
     */
    validarDigitoVerificadorNIT(nit) {
        try {
            const partes = nit.split('-')
            const numeroBase = partes[0]
            const digitoVerificador = parseInt(partes[1])

            // Pesos para el cálculo (algoritmo DIAN)
            const pesos = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3]

            let suma = 0
            const longitudNumero = numeroBase.length

            // Calcular suma ponderada
            for (let i = 0; i < longitudNumero; i++) {
                const digito = parseInt(numeroBase.charAt(i))
                const peso = pesos[pesos.length - longitudNumero + i]
                suma += digito * peso
            }

            // Calcular dígito verificador esperado
            const residuo = suma % 11
            const digitoEsperado = (residuo > 1) ? (11 - residuo) : residuo

            if (digitoVerificador !== digitoEsperado) {
                return {
                    isValid: false,
                    error: `El dígito verificador del NIT es incorrecto. Debería ser: ${digitoEsperado}`
                }
            }

            return { isValid: true, error: null }
        } catch (error) {
            return {
                isValid: false,
                error: 'Error al validar el NIT'
            }
        }
    }

    /**
     * Detecta el tipo de documento automáticamente
     */
    getTipoDocumento() {
        const numero = this.numeroDocumento.trim()
        if (/^\d{6,12}$/.test(numero)) {
            return 'CC'
        } else if (/^\d{9}-\d{1}$/.test(numero)) {
            return 'NIT'
        }
        return 'DESCONOCIDO'
    }

    /**
     * Formatea el input del documento (solo números y guión)
     */
    formatearInput(valor) {
        // Permitir solo números y guión
        let valorFormateado = valor.replace(/[^\d-]/g, '')
        
        // Solo permitir un guión
        const partes = valorFormateado.split('-')
        if (partes.length > 2) {
            valorFormateado = partes[0] + '-' + partes.slice(1).join('')
        }
        
        // Limitar longitud
        if (valorFormateado.includes('-')) {
            // NIT: máximo 11 caracteres (123456789-0)
            valorFormateado = valorFormateado.substring(0, 11)
        } else {
            // CC: máximo 12 dígitos
            valorFormateado = valorFormateado.substring(0, 12)
        }
        
        return valorFormateado
    }

    /**
     * Convierte a objeto para enviar al servidor
     */
    toJSON() {
        return {
            nombreRazonSocial: this.nombreRazonSocial.trim(),
            numeroDocumento: this.numeroDocumento.trim(),
            estado: this.estado
        }
    }

    /**
     * Crea una instancia desde datos del formulario
     */
    static fromFormData(formData) {
        return new ClienteRegistro(formData)
    }
}

export default ClienteRegistro