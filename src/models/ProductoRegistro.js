/**
 * Modelo para registrar un nuevo producto
 */
export class ProductoRegistro {
    constructor(data = {}) {
        this.nombre = data.nombre || ''
        this.descripcion = data.descripcion || ''
        this.precioVenta = data.precioVenta || 0
        this.iva = data.iva || 0
    }

    /**
     * Valida los datos del producto
     */
    validate() {
        const errors = []

        if (!this.nombre || this.nombre.trim() === '') {
            errors.push('El nombre es requerido')
        } else if (this.nombre.length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres')
        }

        if (!this.descripcion || this.descripcion.trim() === '') {
            errors.push('La descripción es requerida')
        } else if (this.descripcion.length < 10) {
            errors.push('La descripción debe tener al menos 10 caracteres')
        }

        if (!this.precioVenta || this.precioVenta <= 0) {
            errors.push('El precio de venta debe ser mayor a 0')
        }

        if (this.iva < 0 || this.iva > 100) {
            errors.push('El IVA debe estar entre 0 y 100')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    /**
     * Convierte a objeto para enviar al servidor
     */
    toJSON() {
        return {
            nombre: this.nombre,
            descripcion: this.descripcion,
            precioVenta: Number(this.precioVenta),
            iva: Number(this.iva)
        }
    }
}