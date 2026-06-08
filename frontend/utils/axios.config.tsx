import axios from 'axios'

const axiosConfig = (isSurabaya: boolean) =>
  axios.create({
    baseURL: isSurabaya ? process.env.BASE_API_URL : process.env.API_URL_WEBDISPLAY,
    headers: {
      'Content-Type': 'application/json',
      Signature: process.env.SIGNATURE || 'no-signature',
    },
  })

export default axiosConfig
