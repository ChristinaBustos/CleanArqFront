import { Module } from 'vuex';
import { RootState } from '@/store/state';
import { Period } from '@/modules/periods/entities/Period';
import { getPeriodById } from '@/modules/subperiods/boundary.module';
import { GetPeriodById } from '@/modules/periods/entities/dto/GetPeriodById';
export interface PeriodsState {
  currentPeriod: Period | null;
  periods: Period[];
}

export const periods: Module<PeriodsState, RootState> = {
  namespaced: true,
  state: {
    currentPeriod: null,
    periods: []
  },
  mutations: {
    SET_CURRENT_PERIOD(state, period: Period) {
      state.currentPeriod = period;
    },
    SET_PERIODS(state, periods: Period[]) {
      state.periods = periods;
    }
  },
  actions: {
    async getPeriodById({ commit }, id: number) {
      try {
        const payload: GetPeriodById = { id };
        const response = await getPeriodById(payload);
        if (response && response.result) {
          commit('SET_CURRENT_PERIOD', response.result);
        }
        return response;
      } catch (error) {
        console.error('Error al obtener el período:', error);
        throw error;
      }
    }
  },
  getters: {
    currentPeriod: state => state.currentPeriod,
    periods: state => state.periods
  }
}; 