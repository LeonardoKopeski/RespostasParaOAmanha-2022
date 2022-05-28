// Socket.io
const socket = io()

// Search Box
var searches = {
    gato: ["gato", "felino", "animal"],
    cachorro: ["cachorro", "cão", "animal"],
    macaco: ["macaco", "animal"],
    arvore: ["arvore", "floresta", "planta"],
    flor: ["flor", "planta"],
    batata: ["batata", "vegetal", "fruta"],
    chuva: ["chuva", "pluviômetro", "tempo"],
    sol: ["sol", "pluviômetro", "tempo"],
    felicidade: ["felicidade", "emocional", "emocão"],
    azul: ["azul", "cor", "cores"],
}

var searchBox = document.querySelector("input.searchBox")
var suggestionsUl = document.querySelector("div.searchSuggestions ul")
searchBox.addEventListener("keyup", ()=>{
    if(searchBox.value.length > 0){
        document.querySelector(".searchSuggestions").classList.remove("invisible")
        document.querySelector(".left").classList.add("invisible")
        document.querySelector(".right").classList.add("invisible")
    }else{
        document.querySelector(".searchSuggestions").classList.add("invisible")
        document.querySelector(".left").classList.remove("invisible")
        document.querySelector(".right").classList.remove("invisible")
    }

    let result = search(searches, searchBox.value.toLowerCase())
    let average = squareAverage(Object.values(result))

    suggestionsUl.innerHTML = ""
    Object.keys(result).forEach(key=>{
        if(result[key] ** 2 <= average){
            return
        }
        var li = document.createElement("li")
        var i = document.createElement("i")
        var span = document.createElement("span")
        i.classList.add("fa-solid", "fa-magnifying-glass")

        span.innerText = key

        suggestionsUl.appendChild(li)
        li.appendChild(i)
        li.appendChild(span)
    })
})

// Buttons
function openUrl(url){
    window.open(url, "_SELF")
}