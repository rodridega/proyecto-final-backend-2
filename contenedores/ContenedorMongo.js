import mongoose from 'mongoose'
import config from '../config.js'

//await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

class ContenedorMongo {

    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async getAll(){
        await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)
        try{
            const respuesta = await this.coleccion.find().sort({id: 1})
            mongoose.connection.close()
            return respuesta
        }catch(err){
            return []     
        }
    }

    async getById(x){
        await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)
        try{
            const respuesta = await this.coleccion.find({id:{$eq: `${x}`}})
            mongoose.connection.close()
            return respuesta
        }catch(err){
            throw new Error(`Error leer el ID de archivo: ${err}`)
        }
    }

    async saveAll(newArray){   
        try{
            let preSave = await this.getAll()
            
            if(preSave.length === 0){
                await this.coleccion.insertMany(newArray)
            }else{
                await this.coleccion.deleteMany({})
                await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)
                await this.coleccion.insertMany(newArray)
            }
            mongoose.connection.close()
        }catch(error){
            throw new Error(`Error leer el ID de archivo: ${error}`)
        }
    }

    async save(newObj){
        try{
            let preSave = await this.getAll()
            let newId
            if(preSave.length == 0){
                newId = 1
            }else{
                newId = parseInt(preSave[preSave.length-1]._id) + 1
            }
            await this.coleccion.insertMany({id:newId, ...newObj})
            mongoose.connection.close()   
        }catch(error){
            throw new Error(`Error leer el ID de archivo: ${error}`)
        }
    }

    async putById(x,newObj){
        await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)
        try{
            await this.coleccion.replaceOne({id:{$eq: `${x}`}} ,newObj)
            mongoose.connection.close()
        }catch(error){
            throw new Error(`Error leer el ID de archivo: ${error}`)
        } 
    }

    async deleteById(x){
        await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)
        try{
            await this.coleccion.deleteOne({id:{$eq: `${x}`}})
            mongoose.connection.close()
        }catch(error){
            throw new Error(`Error leer el ID de archivo: ${error}`)
        }
    }

    async deleteAll(){
        await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)
        try{
            await this.coleccion.deleteMany({})
            mongoose.connection.close()
        }catch(error){
            throw new Error(`Error leer el ID de archivo: ${error}`)
        }
    }
}

export default ContenedorMongo