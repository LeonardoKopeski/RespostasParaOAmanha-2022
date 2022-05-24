import axios from "axios"

export default async function synthesize(obj) {
    const url = `https://api.voicerss.org/?key=${process.env.VOICERSS_KEY}&hl=pt-br&v=Ligia&f=48khz_16bit_mono&r=${obj.speed}&src=${encodeURI(obj.text)}`
    let result = await axios.request({method: 'GET', url})
    return Buffer.from(result.data)
}