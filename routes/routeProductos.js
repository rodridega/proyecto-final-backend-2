import { Router } from "express"
import { productosDao as productosApi } from '../daos/index.js'

const routerProductos = Router()
let administrador = true


//MUESTRA TODOS LOS PRODUCTOS
routerProductos.get('/', async(req, res) => {  
    let allProductos = await productosApi.getAll()
    if(allProductos.length === 0){
        res.send({ "error" : "No existen productos" })    
    }else{
        res.send(allProductos)    
    }   
})

// MUESTRA UN PRODUCTO SEGUN SU ID
routerProductos.get('/:id', async(req, res) => { 
    let allProductos = await productosApi.getAll()
    const iD = allProductos.find(producto => parseInt(producto.id) === parseInt(req.params.id));
    if (iD) {
        res.send(iD)
    } else {
        res.status(400).json({ error : "Producto no encontrado" });
    }   
})


// AGREGA UN PRODUCTO Y MUESTRA SU ID ASIGNADO
routerProductos.post('/', async(req, res) => { 
    if(administrador){
 
        const { name, description, code, urlImage, price, stock } = req.body
        
        let allProductos = await productosApi.getAll()
        let newId
        let fecha = new Date()

       
        if(!name || !description || !code || !urlImage || !price || !stock){
            console.log("if", name);
            res.status(400).json({ "error": "Faltan datos en el producto que intentas guardar" });
        }
        if(allProductos.length === 0){
            newId=1
        }else{
            newId = parseInt(allProductos[allProductos.length-1].id) + 1
        }
       
        allProductos.push({id: newId, 'timestamp(producto)': fecha, name, description, code, urlImage, price, stock})
        await productosApi.saveAll(allProductos)
        res.send({id: newId, 'timestamp(producto)': fecha, name, description, code, urlImage, price, stock}) 
    }else{
        res.send({ error : -1,
                    description: `ruta /api/productos/ método POST no autorizado`
                 })        
    }        
})

//ACTUALIZA UN PRODUCTO SEGUN SU ID
routerProductos.put('/:id', async(req, res) => { 
    if(administrador){ 
        let allProductos = await productosApi.getAll()   
        const iD = allProductos.find(producto => parseInt(producto.id) === parseInt(req.params.id));
        const { name, description, code, urlImage, price, stock } = req.body
        let fecha = new Date()

        if(!iD) {
            res.status(400).json({ error : "Producto no encontrado" });
        }else{
            if(!name || !description || !code || !urlImage || !price || !stock){
                res.status(400).json({ "error": "Ingrese todos los datos del producto" })
            }else{
                const newProducto = {
                    "id": parseInt(req.params.id),
                    "timestamp(producto)": fecha,
                    "name": name,
                    "description": description,
                    "code": code,
                    "urlImage": urlImage,
                    "price": price,
                    "stock": stock
                }
                await productosApi.putById(parseInt(req.params.id),newProducto)
                allProductos = await productosApi.getAll()
                const iD = allProductos.find(producto => parseInt(producto.id) === parseInt(req.params.id));
                res.send(iD)
            }    
        }
    }else{
        res.send({ error : -1,
                    description: `ruta /api/productos/:id método PUT no autorizado`
                 })        
    }
})


// ELIMINA UN PRODUCTO SEGUN SU ID
routerProductos.delete('/:id', async(req, res) => { 
    if(administrador){  
        let allProductos = await productosApi.getAll()  
        const iD = allProductos.find(producto => parseInt(producto.id) === parseInt(req.params.id));
        if (!iD) {
            res.status(400).json({ error : "Producto no encontrado" });
        } else {
            await productosApi.deleteById(parseInt(req.params.id))
            allProductos = await productosApi.getAll()
            res.send(allProductos)
        } 
    }else{
        res.send({ error : -1,
                    description: `ruta /api/productos/:id método DELETE no autorizado`
                 })        
    }    
})

export default routerProductos