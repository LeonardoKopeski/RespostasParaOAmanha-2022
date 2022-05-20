// Library
import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()

// Variables
var schema
var conn
var model

// Functions
export function setSchema(obj){
    schema = new mongoose.Schema(obj)
}

export async function startDB(dotEnvName){
    conn = await mongoose.createConnection(process.env[dotEnvName], {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })

    model = conn.model("device", schema)
}

// Classes
export class device{
    constructor(data){
        Object.keys(data).forEach(key=>{
            this[key] = data[key]
        })
    }

    update(update){
        model.updateOne({fingerprint: this.fingerprint}, update, ()=>{})
    }

    static generateToken(len){
        var token = ""
        for(var c = 0; c < len/10;c++){
            token += Math.random().toString(36).substring(2)
        }
        return token.substring(0, len)
    }

    static createDevice(obj){
        var res = new model(obj)
        res.save()

        return new device(obj)
    }

    static getDevice(query){
        return new Promise((resolve, reject) => {
            model.find(query, (err, response)=>{
                if(err){
                    reject(err)
                }else{
                    var res = []

                    response.forEach(elm=>{
                        var r = elm._doc
                        delete r.__v
                        delete r._id
                        res.push(new device(r))
                    })
    
                    resolve(res)
                }
            })
        })
    }
}