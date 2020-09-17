<template>
  <div id="app">
    <div class="container con-crypto">
      <div class="con-header header-crypto">
        <div>Logo</div>
        <div>Name</div>
        <div>Price USD</div>
        <div>High hour USD</div>
        <div>Low hour USD</div>
        <div>Change in hour %</div>
      </div>

      <crypto-bar v-for="crypto in allCryptos" :key="crypto.name" 
      :crypto="crypto"
      :subPrev="subprevCryptos(crypto.name)"
      :class="(crypto.name == pickedCrypto) ? 'picked' : ''"
      @picked="toogleCrypto(crypto.name)"
      >
      </crypto-bar>
    </div>

    <exchange :pickedCrypto="pickedCrypto" @changeFromCrypto="clearPick"></exchange>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    CryptoBar: () => import('./components/CryptoBar.vue'),
    Exchange: () => import('./components/Exchange.vue')
  },
  data: () => ({
    subPrices: [],
    prevCryptos: {},
    pickedCrypto: ''
  }),
  computed: mapGetters(['allCryptos']),
  methods: {
    clearPick() {
      this.pickedCrypto = ''
    },
    toogleCrypto(name) {
      if (this.pickedCrypto == name) this.pickedCrypto = ''
      else this.pickedCrypto = name
    },
    subprevCryptos(name) {
      for (let cr of this.subPrices) {
        if (cr.name == name) return cr.sub
      }
    },
    ...mapActions(['fetchCryptos']),
  },
  async mounted() {
    await this.fetchCryptos()
    this.prevCryptos = this.allCryptos
    
    setInterval(async () => {
      await this.fetchCryptos()

      this.subPrices = []
      for (let i = 0; i < this.allCryptos.length; i++) {
        this.subPrices.push({name: this.allCryptos[i].name, sub: (+this.allCryptos[i].USD.PRICE - +this.prevCryptos[i].USD.PRICE )})
      }

      this.prevCryptos = this.allCryptos
    }, 3000)
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.container {
  box-shadow: 0px 0px 5px 1px;
  border-radius: 5px;
  margin: 8px;
  padding: 8px;
}

.con-header {
  padding: 0 5px 8px;
  border-bottom: 1px solid #b6b6b6;
}

.con-crypto {
  float: left;
  width: 700px;
}

.con-exchange {
  float: left;
}

.header-crypto {
  display: grid;
  grid-template-columns: 1fr 1fr repeat(4, 3fr);
  justify-items: left;
}
</style>
