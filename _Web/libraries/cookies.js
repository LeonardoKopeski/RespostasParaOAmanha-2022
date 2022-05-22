function setCookie(name, value, exdays) {
    const date = new Date()
    date.setTime(date.getTime() + (exdays*24*60*60*1000))
    document.cookie = name + "=" + value + ";expires="+ date.toUTCString() + ";path=/"
}

function getCookie(name) {
    name += "="
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}