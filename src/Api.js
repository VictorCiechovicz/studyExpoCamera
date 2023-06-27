import axios from 'axios'

const api = axios.create({
  baseURL: 'https://salas-iffar-api.netlify.app/.netlify/functions/api'
})

export default api
