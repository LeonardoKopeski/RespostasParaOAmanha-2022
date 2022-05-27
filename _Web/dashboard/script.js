// Socket.io
const socket = io()

// Search Box
var searchBox = document.querySelector("input.searchBox")
searchBox.addEventListener("keyup", ()=>{
    if(searchBox.value.length > 0){
        document.querySelector(".left").classList.add("hidden")
        document.querySelector(".right").classList.add("hidden")
    }else{
        document.querySelector(".left").classList.remove("hidden")
        document.querySelector(".right").classList.remove("hidden")
    }
})