import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
// Agregamos la URL base de nuestra API
axios.defaults.baseURL = 'http://localhost:4000/api';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

createApp(App).use(store).use(router).use(VueAxios, axios).mount('#app')
