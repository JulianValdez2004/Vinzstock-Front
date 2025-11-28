 /*
 * Modelo de Cliente (para mostrar/leer datos)
 */
export class Cliente {
    constructor(data = {}) {
        this.idCliente = data.idCliente || null
        this.nombreRazonSocial = data.nombreRazonSocial || ''
        this.numeroDocumento = data.numeroDocumento || ''
        this.estado = data.estado !== undefined ? data.estado : true
    }

    /**
     * Detecta el tipo de documento (CC o NIT)
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
     * Formatea el documento para mostrar
     */
    formatearDocumento() {
        const numero = this.numeroDocumento.trim()
        const tipo = this.getTipoDocumento()
        
        if (tipo === 'CC') {
            // Formatear CC con puntos de miles: 1.234.567.890
            return numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        }
        
        return numero // NIT ya viene formateado con guión
    }

    /**
     * Obtiene el texto del estado
     */
    getEstadoTexto() {
        return this.estado ? 'ACTIVO' : 'INACTIVO'
    }

    /**
     * Verifica si está activo
     */
    estaActivo() {
        return this.estado === true
    }

    /**
     * Obtiene las iniciales del nombre
     */
    getInitials() {
        return this.nombreRazonSocial
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    /**
     * Convierte el modelo a objeto plano
     */
    toJSON() {
        return {
            idCliente: this.idCliente,
            nombreRazonSocial: this.nombreRazonSocial,
            numeroDocumento: this.numeroDocumento,
            estado: this.estado
        }
    }

    /**
     * Crea una instancia desde datos del servidor
     */
    static fromResponse(data) {
        return new Cliente(data)
    }

    /**
     * Crea una lista de clientes desde respuesta del servidor
     */
    static fromResponseList(dataList) {
        return dataList.map(data => new Cliente(data))
    }
}

export default Cliente