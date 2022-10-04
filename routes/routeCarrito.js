import { Router } from "express"
import { 
    carritosDao as carritosApi,
    productosDao as productosApi } from '../daos/index.js'

const routerCarrito = Router()
let administrador = true

//AGREGA UN CARRITO Y DEVUELVE SU ID ASIGNADO
routerCarrito.post('/', async(req, res) => { 
    let todosLosCarritos = await carritosApi.getAll()
    let nuevoId
    let fecha = new Date()

    if(todosLosCarritos.length === 0){
        nuevoId=1
    }else{
        nuevoId = parseInt(todosLosCarritos[todosLosCarritos.length-1].id) + 1
    }

    todosLosCarritos.push({id: nuevoId, 'timestamp(carrito)': fecha, productos: []})
    await carritosApi.saveAll(todosLosCarritos)
    res.send({ message: `carrito creado con éxito, ID: ${nuevoId}`})       
})

// ELIMINA UN CARRITO SEGUN SU ID
routerCarrito.delete('/:id', async(req, res) => { 
    let todosLosCarritos = await carritosApi.getAll()  
    const iD = todosLosCarritos.find(cart => parseInt(cart.id) === parseInt(req.params.id))

    if (!iD) {
        res.status(400).json({ error : "Ese Carrito no existe!" });
    } else {
        await carritosApi.deleteById(parseInt(req.params.id))
        todosLosCarritos = await carritosApi.getAll()
        res.send({ message: 'carrito borrado con éxito'})
    }   
})


// MUESTRA LOS PRODUCTOS DE UN CARRITO SEGUN SU ID
routerCarrito.get('/:id/productos', async(req, res) => { 
    let todosLosCarritos = await carritosApi.getAll()
    const iD = todosLosCarritos.find(cart => parseInt(cart.id) === parseInt(req.params.id))

    if (iD) {
        res.send(iD.productos)
    } else {
        res.status(400).json({ error : "Carrito no encontrado" });
    }   
})

// AGREGA PRODUCTOS A UN CARRITO SEGUN EL ID DE PRODUCTO
routerCarrito.post('/:id/productos', async(req, res) => { 
    let todosLosCarritos = await carritosApi.getAll()
  
    const carritoId = todosLosCarritos.find(cart => parseInt(cart.id) === parseInt(req.params.id))
    
    const indiceCarrito = todosLosCarritos.map(cart => parseInt(cart.id)).indexOf(parseInt(req.params.id))
    
    if (carritoId) {
        const { idProducto } = req.body
        let todosLosProductos = await productosApi.getAll()
        const iD = todosLosProductos.find(producto => parseInt(producto.id) === idProducto)
        if (iD) {
            todosLosCarritos[indiceCarrito].productos.push(iD)
            await carritosApi.saveAll(todosLosCarritos)
            res.send(`Producto con ID: ${idProducto} agregado exitosamente al carrito con ID: ${req.params.id}`)    
        }else{
            res.status(400).json({ "error": "Ingrese el ID del producto" })
        }

    }else{
        res.status(400).json({ error : "Carrito no encontrado" });
    }   
})

// ELIMINA UN PRODUCTO DE UN CARRITO SEGUN SU ID DE PRODUCTO Y DE CARRITO
routerCarrito.delete('/:id/productos/:id_prod', async(req, res) => {
    let todosLosCarritos = await carritosApi.getAll()
    const carritoId = todosLosCarritos.find(cart => parseInt(cart.id) === parseInt(req.params.id))
    const indiceCarrito = todosLosCarritos.map(cart => parseInt(cart.id)).indexOf(parseInt(req.params.id))

    if (carritoId) {
        const arrayProd = todosLosCarritos[indiceCarrito].productos
        const iDProd = arrayProd.find(producto => parseInt(producto.id) === parseInt(req.params.id_prod))

        if (iDProd) {
            const filterId = arrayProd.filter((item) => parseInt(item.id) !== parseInt(req.params.id_prod))
            todosLosCarritos[indiceCarrito].productos = filterId
            await carritosApi.saveAll(todosLosCarritos)
            res.send(`Producto Eliminado con exito`) 
        } else {
            res.status(400).json({ error : "Producto no encontrado" });
        } 
        
    }else{
        res.status(400).json({ error : "Carrito no encontrado" });
    }   
})

export default routerCarrito