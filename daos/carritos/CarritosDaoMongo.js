import ContenedorMongo from "../../contenedores/ContenedorMongo.js"

class CarritosDaoMongo extends ContenedorMongo {

    constructor() {
        super('carritos', {
            id: {type: Number, require: true, max: 255},
            'timestamp(carrito)': {type: String, require: true, max: 255},
            productos: {type: [], require: true}            
        })
    }
}

export default CarritosDaoMongo