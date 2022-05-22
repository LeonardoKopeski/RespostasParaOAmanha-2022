async function audioHandler(){
    const mediaStreamObj = await navigator.mediaDevices.getUserMedia({audio: true})

    const mediaRecorder = new MediaRecorder(mediaStreamObj)
    mediaRecorder.start()
    
    let dataArray = []
    mediaRecorder.ondataavailable = function (ev) {
        dataArray.push(ev.data)
    }

    mediaRecorder.onstop = function (ev) {
        let audioData = new Blob(dataArray, { 'type': 'audio/mp3;' })
        console.log(dataArray, audioData)

        dataArray = []
        //let audioSrc = window.URL.createObjectURL(audioData);
        //playAudio.src = audioSrc;
        //console.log(audioSrc, )
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