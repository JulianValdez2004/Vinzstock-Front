/**
 * Modelo de Producto
 */
export class Producto {
    constructor(data = {}) {
        this.idProducto = data.idProducto || null
        this.nombre = data.nombre || ''
        this.descripcion = data.descripcion || ''
        this.precioVenta = data.precioVenta || 0
        this.iva = data.iva || 0
    }

    /**
     * Calcula el precio con IVA incluido
     */
    getPrecioConIva() {
        return this.precioVenta + (this.precioVenta * this.iva / 100)
    }

    /**
     * Calcula el valor del IVA
     */
    getValorIva() {
        return this.precioVenta * this.iva / 100
    }

    /**
     * Formatea el precio con IVA para mostrar
     */
    getPrecioFormateado() {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(this.getPrecioConIva())
    }

    /**
     * Convierte el modelo a objeto plano para localStorage
     */
    toJSON() {
        return {
            idProducto: this.idProducto,
            nombre: this.nombre,
            descripcion: this.descripcion,
            precioVenta: this.precioVenta,
            iva: this.iva
        }
    }

    /**
     * Crea una instancia desde datos del servidor
     */
    static fromResponse(data) {
        return new Producto(data)
    }
}