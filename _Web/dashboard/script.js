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
    console.log(obj)
})