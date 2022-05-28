import express from "express"
import httpServer from "http"
import {Server} from "socket.io"
import shajs from 'sha.js'
import fs from "fs"
import synthesize from "./libraries/Synthesizer.js"
import * as dbDevices from "./libraries/devices.js"

// Libraries
const getDevice = dbDevices.device.getDevice
const app = express()
const http = httpServer.createServer(app)
const io = new Server(http)

// Devices
app.use(express.static("../_Web"))

// Socket.io
io.on('connection', (socket) => {
    socket.on("linker/checkId", async(obj)=>{
        if(typeof obj !== "object"){return}

        var device = await getDevice({idNumber: obj.id})
        if(device[0]){
            let fingerprint = device[0].fingerprint + socket.id
            socket.emit("linker/checkId/response", {
                exists: true,
                hasPassword: device[0].password !== null,
                fingerprint: new shajs.sha256().update(fingerprint).digest('hex')
            })
        }else{
            socket.emit("linker/checkId/response", {
                exists: false,
                hasPassword: false
            })
        }
    })
    socket.on("linker/setPassword", async(obj)=>{
        if(typeof obj !== "object"){return}
        if(obj.password === ""){return}

        var device = await getDevice({idNumber: obj.id})
        if(!device[0]){
            socket.emit("linker/setPassword/response", {error: 404})
            return
        }

        if(device[0].password !== null){
            socket.emit("linker/setPassword/response", {error: 403})
            return
        }

        let fingerprint = device[0].fingerprint + socket.id
        let hashedFingerprint = new shajs.sha256().update(fingerprint).digest('hex')
        if(hashedFingerprint !== obj.fingerprint){
            socket.emit("linker/setPassword/response", {error: 403})
            return
        }

        let securityPass = dbDevices.device.generateToken(32)
        device[0].update({password: obj.password, securityPass: securityPass})
        socket.emit("linker/setPassword/response", {status: "ok"})
    })
    socket.on("linker/checkPassword", async(obj)=>{
        if(typeof obj !== "object"){return}

        var device = await getDevice({idNumber: obj.id})
        if(!device[0]){
            socket.emit("linker/checkPassword/response", {status: 404})
            return
        }

        if(device[0].password === obj.password){
            socket.emit("linker/checkPassword/response", {status: 200, securityPass: device[0].securityPass})
        }else{
            socket.emit("linker/checkPassword/response", {status: 403})
        }
    })
    socket.on("linker/setName", async(obj)=>{
        if(typeof obj !== "object"){return}

        var device = await getDevice({idNumber: obj.id})
        if(!device[0]){
            socket.emit("linker/setName/response", {error: 404})
            return
        }

        let fingerprint = device[0].fingerprint + socket.id
        let hashedFingerprint = new shajs.sha256().update(fingerprint).digest('hex')
        if(hashedFingerprint !== obj.fingerprint){
            socket.emit("linker/setName/response", {error: 403})
            return
        }

        device[0].update({name: obj.name})
        socket.emit("linker/setName/response", {status: "ok", securityPass: device[0].securityPass})
    })
    socket.on("dashboard/getInfo", async(obj)=>{
        if(typeof obj !== "object"){return}

        const query = {securityPass: obj.securityPass}
        const device = await getDevice(query)
        
        if(device[0]){
            socket.emit("dashboard/getInfo/response",{
                name: device[0].name,
                idNumber: device[0].idNumber
            })  
        }
    })
})

// Listen to the port
const PORT = process.env.PORT || 18018
http.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)

    dbDevices.setSchema({
        idNumber: String,
        password: String,
        name: String,
        fingerprint: String,
        securityPass: String
    })
    dbDevices.startDB("DB_DEVICES")
    
    //synthesize({
    //    speed: 2.5,
    //    text: "Alarme definido para daqui a 37 minutos!"
    //}).then(console.log)
})