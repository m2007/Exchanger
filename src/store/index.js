import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cryptos: []
  },
  mutations: {
    updateCryptos(state, cryptosData) {
      state.cryptos = cryptosData
    }
  },
  actions: {
    async fetchCryptos(ctx) {
      let key = '0b3032eb5d8100ff9d485abb77a3ad7761583f959d5cf13bf09ae1debfe36a72'
      let listCryptos = ['BTC', 'ETH', 'LTC', 'ETC', 'UNI', 'TRX', 'YFI']
      const {data} = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${listCryptos}&tsyms=USD,EUR,RUB&api_key=${key}`)
      let tempArr = []
      Object.entries(data.RAW).forEach(([name, exchanges]) => {
        tempArr.push({
          name,
          ...exchanges
        })
      })
      ctx.commit('updateCryptos', tempArr)
    }
  },
  getters: {
    allCryptos(state) {
      return state.cryptos
    }
  }
})
