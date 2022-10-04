import { Router } from "express"
import { 
    carritosDao as carritosApi,
    productosDao as productosApi } from '../daos/index.js'

const routerCarrito = Router()
let administrador = true

routerCarrito.post('/', async(req, res) => { //Recibe y agrega un carrito, y devuelve su id asignado
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
    res.send({id: nuevoId})       
})

routerCarrito.delete('/:id', async(req, res) => { //Elimina un carrito según su id   
    let todosLosCarritos = await carritosApi.getAll()  
    const iD = todosLosCarritos.find(cart => parseInt(cart.id) === parseInt(req.params.id))

    if (!iD) {
        res.status(400).json({ error : "No existe el carrito que estas buscando" });
    } else {
        await carritosApi.deleteById(parseInt(req.params.id))
        todosLosCarritos = await carritosApi.getAll()
        res.send(todosLosCarritos)
    }   
})

routerCarrito.get('/:id/productos', async(req, res) => { //Devuelve los productos de un carrito segun su id
    let todosLosCarritos = await carritosApi.getAll()
    const iD = todosLosCarritos.find(cart => parseInt(cart.id) === parseInt(req.params.id))

    if (iD) {
        res.send(iD.productos)
    } else {
        res.status(400).json({ error : "Carrito no encontrado" });
    }   
})

routerCarrito.post('/:id/productos', async(req, res) => { //Incorporar productos al carrito por su id de producto
    let todosLosCarritos = await carritosApi.getAll()
   
    const iDCart = todosLosCarritos.find(cart => parseInt(cart.id) === parseInt(req.params.id))
    
    const indexCart = todosLosCarritos.map(cart => parseInt(cart.id)).indexOf(parseInt(req.params.id))

    if (iDCart) {
        const { idProducto } = req.body
        let allProductos = await productosApi.getAll()
        const iD = allProductos.find(producto => parseInt(producto.id) === idProducto)
        console.log(allProductos);
        if (iD) {
            todosLosCarritos[indexCart].productos.push(iD)
            await carritosApi.saveAll(todosLosCarritos)
            res.send(`Producto con ID: ${idProducto} agregado exitosamente al carrito con ID: ${req.params.id}`)    
        }else{
            res.status(400).json({ "error": "Ingrese el ID del producto" })
        }

    }else{
        res.status(400).json({ error : "Carrito no encontrado" });
    }   
})

routerCarrito.delete('/:id/productos/:id_prod', async(req, res) => { //Elimina un producto del carrito por su id de carrito y de producto
    let todosLosCarritos = await carritosApi.getAll()
    const iDCart = todosLosCarritos.find(cart => parseInt(cart.id) === parseInt(req.params.id))
    const indexCart = todosLosCarritos.map(cart => parseInt(cart.id)).indexOf(parseInt(req.params.id))

    if (iDCart) {
        const arrayProd = todosLosCarritos[indexCart].productos
        const iDProd = arrayProd.find(producto => parseInt(producto.id) === parseInt(req.params.id_prod))

        if (iDProd) {
            const filterId = arrayProd.filter((item) => parseInt(item.id) !== parseInt(req.params.id_prod))
            todosLosCarritos[indexCart].productos = filterId
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