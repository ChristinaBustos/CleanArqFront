import Vue from 'vue';
import Vuex from 'vuex';
import { loader } from './modules/loader';
import { auth } from './modules/auth';
import { periods } from './modules/periods';
import { state } from './state';

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  modules: {
    loader,
    auth,
    periods
  }
});