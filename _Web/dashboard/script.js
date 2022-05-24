// Socket.io
const socket = io()

// Get Devices
const cookie = getCookie("connections")
if(cookie === ""){
    open("/linker","_SELF")
}

// Set menu
var thisMenu = "root"
function setMenu(menu, name){
    document.querySelector("div.main ."+thisMenu).classList.add("invisible")
    document.querySelector("div.main ."+menu).classList.remove("invisible")

    document.querySelector("div.main header h2").innerText = name

    document.querySelector("div.main header svg").style.opacity = menu === "root"?0:1

    thisMenu = menu
}