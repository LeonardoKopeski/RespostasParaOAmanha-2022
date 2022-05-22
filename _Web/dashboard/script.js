// Socket.io
const socket = io()

// Get Devices
const cookie = getCookie("connections")
if(cookie !== ""){
    const cookieObj = JSON.parse(cookie)
    cookieObj.forEach(elm => {
        socket.emit("dashboard/getInfo", {fingerprint: elm})
    })
}
socket.on("dashboard/getInfo/response",(obj)=>{
})

// Record Audio
audioHandler().then((stop)=>{
    setTimeout(()=>{
        stop()
    }, 3000)
})