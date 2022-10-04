import { switcher } from '../utils/databaseSwitcher.js'

let productosDao
let carritosDao

switch (switcher) {
    case 'txt':
        const { default: ProductosDaoArchivo } = await import('./productos/productosDaoArchivo.js')
        const { default: CarritosDaoArchivo } = await import('./carritos/CarritosDaoArchivo.js')

        productosDao = new ProductosDaoArchivo()
        carritosDao = new CarritosDaoArchivo()
        break
    case 'firebase':
        const { default: ProductosDaoFirebase } = await import('./productos/ProductosDaoFirebase.js')
        const { default: CarritosDaoFirebase } = await import('./carritos/CarritosDaoFirebase.js')

        productosDao = new ProductosDaoFirebase()
        carritosDao = new CarritosDaoFirebase()
        break
    case 'mongo':
        const { default: ProductosDaoMongo } = await import('./productos/ProductosDaoMongo.js')
        const { default: CarritosDaoMongo } = await import('./carritos/CarritosDaoMongo.js')

        productosDao = new ProductosDaoMongo()
        carritosDao = new CarritosDaoMongo()
        break
    default: 
        // do nothing;           
        break
}

export { productosDao, carritosDao }