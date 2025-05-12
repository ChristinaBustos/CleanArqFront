export const loader = {
  state: {
    isLoading: false
  },
  mutations: {
    SET_LOADING(state: any, value: boolean) {
      state.isLoading = value;
    },
  },
  getters: {
    isLoading(state: any) {
      return state.isLoading;
    },
    getLoading(state: any) : boolean{
      return state.isLoading;
    }
  },


  actions: {
    showLoader({ commit }: any) {
      commit('SET_LOADING', true);
    },
    hideLoader({ commit }: any) {
      commit('SET_LOADING', false);
    }
  }
};