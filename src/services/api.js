import axios from 'axios';

require('dotenv/config');


console.log(process.env.PORT);
console.log(process.env.BASE_URL);

const api = axios.create({
  baseURL: 'http://2b2fabbb.ngrok.io',
  headers:{
    'Content-Type': 'application/json'
  }
})

export default api;
