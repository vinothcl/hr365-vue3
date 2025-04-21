import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/main.css'

import { createApp } from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import App from './App.vue'
const app = createApp(App)
app.use(VueSweetalert2);
app.mount('#app')
