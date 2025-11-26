/**
 * Modelo de Compra/Pedido
 */
export class Compra {
    constructor(data = {}) {
        this.idCompra = data.idCompra || null
        this.idProveedor = data.idProveedor || null
        this.nombreProveedor = data.nombreProveedor || ''
        this.nitProveedor = data.nitProveedor || ''
        this.fecha = data.fecha || null
        this.hora = data.hora || null
        this.valorCompra = data.valorCompra || 0
        this.estado = data.estado || 'Pendiente' // Pendiente, Recibido, Cancelado
        this.detalles = data.detalles ? data.detalles.map(d => new DetalleCompra(d)) : []
    }

    /**
     * Obtiene el badge de color según el estado
     */
    getEstadoBadge() {
        const badges = {
            'Pendiente': { class: 'badge-pending', icon: '⏳', text: 'Pendiente' },
            'Recibido': { class: 'badge-received', icon: '✅', text: 'Recibido' },
            'Cancelado': { class: 'badge-cancelled', icon: '❌', text: 'Cancelado' }
        }
        return badges[this.estado] || badges['Pendiente']
    }

    /**
     * Verifica si el pedido puede ser confirmado
     */
    puedeConfirmar() {
        return this.estado === 'Pendiente'
    }

    /**
     * Verifica si el pedido puede ser cancelado
     */
    puedeCancelar() {
        return this.estado === 'Pendiente'
    }

    /**
     * Verifica si el pedido puede ser eliminado
     */
    puedeEliminar() {
        return this.estado !== 'Recibido'
    }

    /**
     * Formatea la fecha para mostrar
     */
    getFechaFormateada() {
        if (!this.fecha) return ''
        const fecha = new Date(this.fecha)
        return fecha.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    /**
     * Formatea la hora para mostrar
     */
    getHoraFormateada() {
        if (!this.hora) return ''
        return this.hora.substring(0, 5) // HH:MM
    }

    /**
     * Formatea el valor de la compra
     */
    getValorFormateado() {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(this.valorCompra)
    }

    /**
     * Obtiene el total de productos en el pedido
     */
    getTotalProductos() {
        return this.detalles.length
    }

    /**
     * Obtiene el total de unidades en el pedido
     */
    getTotalUnidades() {
        return this.detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0)
    }

    /**
     * Crea una instancia desde datos del servidor
     */
    static fromResponse(data) {
        return new Compra(data)
    }
}

/**
 * Modelo de Detalle de Compra
 */
export class DetalleCompra {
    constructor(data = {}) {
        this.idDetalleCompra = data.idDetalleCompra || null
        this.idProducto = data.idProducto || null
        this.nombreProducto = data.nombreProducto || ''
        this.descripcionProducto = data.descripcionProducto || ''
        this.cantidad = data.cantidad || 0
        this.costoUnitario = data.costoUnitario || 0
        this.costoTotal = data.costoTotal || 0
    }

    /**
     * Formatea el costo unitario
     */
    getCostoUnitarioFormateado() {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(this.costoUnitario)
    }

    /**
     * Formatea el costo total
     */
    getCostoTotalFormateado() {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(this.costoTotal)
    }
}