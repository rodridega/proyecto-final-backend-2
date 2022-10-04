import express from 'express'
import path from 'path';
import {fileURLToPath} from 'url';
import routerProductos from './routes/routeProductos.js'
import routerCarrito from './routes/routeCarrito.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const PORT = process.env.PORT || 8080

const serverPort = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`)
})
serverPort.on('error', error => console.log(`Error en el puerto del servidor: ${error}`))

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(express.static(__dirname + '/public'));

app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)

app.use((req, res, next) => {
    res.send({error: -2, descripcion: `ruta no implementada`})
})