async function audioHandler(callback){
    const mediaStreamObj = await navigator.mediaDevices.getUserMedia({audio: true})

    const mediaRecorder = new MediaRecorder(mediaStreamObj)
    mediaRecorder.start()
    
    let dataArray = []
    mediaRecorder.ondataavailable = function (ev) {
        dataArray.push(ev.data)
    }

    mediaRecorder.onstop = async function (ev) {
        let audioData = new Blob(dataArray, { 'type': 'audio/mp3;' })
        let audioBuffer = await audioData.arrayBuffer()
        callback(audioBuffer)

        dataArray = []
    }

    return ()=> mediaRecorder.stop()
}

/*
.then(audioHandler)
function audioHandler(mediaStreamObj) {
    let audio = document.querySelector('audio')
    if("srcObject" in audio) {
        audio.srcObject = mediaStreamObj
    }else{
        audio.src = window.URL.createObjectURL(mediaStreamObj)
    }

    audio.onloadedmetadata = function (ev) {
        audio.play()
    }
    let start = document.getElementById('btnStart');
    let stop = document.getElementById('btnStop');
    let playAudio = document.getElementById('audioPlay');
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    //start.addEventListener('click', function (ev) {
    //    mediaRecorder.start();
    //})
    //stop.addEventListener('click', function (ev) {
    //    mediaRecorder.stop();
    //})
    //mediaRecorder.ondataavailable = function (ev) {
    //    dataArray.push(ev.data);
    //}
    let dataArray = [];
}
*/