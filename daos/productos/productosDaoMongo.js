import ContenedorMongo from "../../contenedores/ContenedorMongo.js"

class ProductosDaoMongo extends ContenedorMongo {

    constructor() {
        super('productos', {
            id: {type: Number, require: true, max: 255},
            'timestamp(producto)': {type: String, require: true, max: 100},
            nombre: {type: String, require: true, max: 100},
            descripcion: {type: String, require: true, max: 100},
            codigo: {type: String, require: true, max: 100},
            foto: {type: String, require: true, max: 100},
            precio: {type: String, require: true, max: 100},
            stock: {type: String, require: true, max: 100}            
        })
    }
}

export default ProductosDaoMongo