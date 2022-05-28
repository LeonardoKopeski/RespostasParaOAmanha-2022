// Socket.io
const socket = io()

// Step One
var fingerprint
const input1 = document.querySelector("form div.step1 input.id")
const button1 = document.querySelector("form div.step1 input.button")
input1.addEventListener("keyup",(ev)=>{
    let realValue = input1.value.replaceAll(" ","")

    input1.value = realValue.match(/.{1,3}/g).join(" ")

    if(realValue.length !== 9){
        button1.classList.remove("activated")
        return
    }
    if(parseInt(realValue) != realValue){
        button1.classList.remove("activated")
        return
    }
    button1.classList.add("activated")
    if(ev.key === "Enter"){
        button1.click()
    }
})
button1.addEventListener("click",()=>{
    let realValue = input1.value.replaceAll(" ","")

    if(button1.classList.contains("activated")){
        socket.emit("linker/checkId", {id: realValue})
    }
})
socket.on("linker/checkId/response", (res)=>{
    if(!res.exists){
        alert("*** não encontrado!")
        return
    }
    input1.value = input1.value.replaceAll(" ", "")
    fingerprint = res.fingerprint
    changeStep(!res.hasPassword? "step2a": "step2b")
})

// Step Two A
const input2a = document.querySelector("form div.step2a input.pass")
const button2a = document.querySelector("form div.step2a input.button")
input2a.addEventListener("keyup",async(ev)=>{
    if(input2a.value.length < 4){
        button2a.classList.remove("activated")
    }else{
        button2a.classList.add("activated")
    }
    if(ev.key === "Enter"){
        button2a.click()
    }
})
button2a.addEventListener("click",async()=>{
    if(!button2a.classList.contains("activated")){return}

    socket.emit("linker/setPassword", {
        id: input1.value,
        password: await sha256(input2a.value),
        fingerprint: fingerprint
    })
})
socket.on("linker/setPassword/response", (res)=>{
    if(res.error){return}
    changeStep("step3")
})

// Step Two B
const input2b = document.querySelector("form div.step2b input.pass")
const button2b = document.querySelector("form div.step2b input.button")
input2b.addEventListener("keyup",(ev)=>{
    if(input2b.value.length < 4){
        button2b.classList.remove("activated")
    }else{
        button2b.classList.add("activated")
    }
    
    if(ev.key === "Enter"){
        button2b.click()
    }
})
button2b.addEventListener("click",async()=>{
    if(!button2b.classList.contains("activated")){return}

    socket.emit("linker/checkPassword", {
        id: input1.value,
        password: await sha256(input2b.value)
    })
})
socket.on("linker/checkPassword/response", (res)=>{
    if(res.status !== 200){
        alert("Senha incorreta!")
    }else{
        var cookie = getCookie("connections")
        var newCookie = cookie === ""? [] : JSON.parse(cookie)
        if(newCookie.indexOf(res.securityPass) === -1){
            newCookie.push(res.securityPass)
        }
        setCookie("connections", JSON.stringify(newCookie), 365)
        open("/dashboard", "_SELF")
    }
})

// Step Three
const input3 = document.querySelector("form div.step3 input.name")
const button3 = document.querySelector("form div.step3 input.button")
input3.addEventListener("keyup",(ev)=>{
    if(input3.value.length < 3){
        button3.classList.remove("activated")
    }else{
        button3.classList.add("activated")
    }
    if(ev.key === "Enter"){
        button3.click()
    }
})
button3.addEventListener("click",()=>{
    if(button3.classList.contains("activated")){
        socket.emit("linker/setName", {
            id: input1.value,
            fingerprint: fingerprint,
            name: input3.value
        })
    }
})
socket.on("linker/setName/response", (res)=>{
    if(res.error){return}

    var cookie = getCookie("connections")
    var newCookie = cookie === ""? [] : JSON.parse(cookie)
    if(newCookie.indexOf(res.securityPass) === -1){
        newCookie.push(res.securityPass)
    }
    setCookie("connections", JSON.stringify(newCookie), 365)
    open("/dashboard", "_SELF")
})

// Step Change
var step = "step1"
document.querySelector("form div.step1 input").focus()
function changeStep(newStep){
    document.querySelector("form div."+step).classList.add("invisible")
    document.querySelector("form div."+newStep).classList.remove("invisible")
    document.querySelector("form div."+newStep + " input").focus()
    step = newStep
}

// Sha256
async function sha256(message){
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
}