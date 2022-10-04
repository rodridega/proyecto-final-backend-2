import ContenedorMongo from "../../contenedores/ContenedorMongo.js"

class ProductosDaoMongo extends ContenedorMongo {

    constructor() {
        super('productos', {
            id: {type: Number, require: true, max: 255},
            'timestamp(producto)': {type: String, require: true, max: 100},
            name: {type: String, require: true, max: 100},
            description: {type: String, require: true, max: 100},
            code: {type: String, require: true, max: 100},
            urlImage: {type: String, require: true, max: 100},
            price: {type: String, require: true, max: 100},
            stock: {type: String, require: true, max: 100}            
        })
    }
}

export default ProductosDaoMongo