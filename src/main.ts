import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store' 
import moment from 'moment'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import Vuelidate from 'vuelidate'

import VueSweetalert2 from 'vue-sweetalert2';

import Multiselect from 'vue-multiselect';

import './styles/styles.scss'
import './styles/sidebarStyle.css'
import './styles/styles.css'
import './styles/backgroundStyle.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'sweetalert2/dist/sweetalert2.min.css';

import 'vue-multiselect/dist/vue-multiselect.min.css';

import * as FeatherIcons from 'vue-feather-icons';
import GlobalLoader from './components/GlobalLoader.vue';

const options = {
  confirmButtonText: 'Aceptar',
  cancelButtonText: 'Cancelar',
  showCancelButton: true,
  showConfirmButton: true,
  confirmButtonColor: 'var(--primary)',
  cancelButtonColor: 'var(--danger)',
  customClass: {
    confirmButton: 'rounded-pill',
    cancelButton: 'rounded-pill btn btn-outline-danger'
  }

}

Vue.config.productionTip = false

// Configuración global de moment
Vue.prototype.$moment = moment;
moment.locale('es');
// @ts-ignore
Vue.use(Vuelidate)

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueAxios, axios)
Vue.use(VueSweetalert2, options);

//sweet alert options

Object.keys(FeatherIcons).forEach((iconName) => {
  Vue.component(iconName, (FeatherIcons as any)[iconName]);
});

Vue.component('GlobalLoader', GlobalLoader);
Vue.component('multiselect', Multiselect);

// Inicializar el estado de autenticación desde el token JWT antes de montar la app
store.dispatch('auth/initializeStore').finally(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
});
