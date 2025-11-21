export class CompraRegistro {
    constructor(data = {}) {
        this.idProveedor = data.idProveedor || null
        this.detalles = Array.isArray(data.detalles)
            ? data.detalles.map(d => new DetalleCompra(d))
            : []
    }

    validate() {
        const errors = []

        if (!this.idProveedor) {
            errors.push('El proveedor es obligatorio')
        }

        if (this.detalles.length === 0) {
            errors.push('Debe agregar al menos un producto')
        }

        this.detalles.forEach((detalle, index) => {
            const { isValid, errors: detalleErrors } = detalle.validate()
            if (!isValid) {
                errors.push(`Error en producto #${index + 1}: ${detalleErrors.join(', ')}`)
            }
        })

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    toJSON() {
        return {
            idProveedor: this.idProveedor,
            detalles: this.detalles.map(d => d.toJSON())
        }
    }
}

export class DetalleCompra {
    constructor(data = {}) {
        this.idProducto = data.idProducto || null
        this.cantidad = data.cantidad || 1
        this.precioUnitario = data.precioUnitario || 0
    }

    validate() {
        const errors = []

        if (!this.idProducto) {
            errors.push('El producto es obligatorio')
        }

        if (!this.cantidad || this.cantidad <= 0) {
            errors.push('La cantidad debe ser mayor a 0')
        }

        if (!this.precioUnitario || this.precioUnitario <= 0) {
            errors.push('El precio unitario debe ser mayor a 0')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    toJSON() {
        return {
            idProducto: this.idProducto,
            cantidad: Number(this.cantidad),
            precioUnitario: Number(this.precioUnitario)
        }
    }
}

