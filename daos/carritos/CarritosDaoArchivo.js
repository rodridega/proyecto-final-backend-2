import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

class CarritosDaoArchivo extends ContenedorArchivo {

    constructor() {
        super('carrito.txt')
    }
}

export default CarritosDaoArchivo