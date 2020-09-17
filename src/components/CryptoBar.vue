<template>
  <div class="cryptobar" @click="onPickCrypto()">
    <img class="logo" :src="'https://www.cryptocompare.com' + crypto.USD.IMAGEURL">
    <div>{{crypto.name}}</div>
    <div :class="(updPrices && subPrev) ? (subPrev < 0 ? 'red-bcl' : 'green-bcl') : ''">{{+crypto.USD.PRICE.toFixed(10)}}</div>
    <div>{{+crypto.USD.HIGHHOUR.toFixed(10)}}</div>
    <div>{{+crypto.USD.LOWHOUR.toFixed(10)}}</div>
    <div>{{+(crypto.USD.CHANGE24HOUR / crypto.USD.PRICE * 100).toFixed(5)}}</div>
  </div>
</template>

<script>
export default {
  name: "CryptoBar",
  props: ['crypto', 'subPrev'],
  data: () => ({
    updPrices: true
  }),
  methods: {
    onPickCrypto() {
      this.$emit('picked')
    }
  },
  watch: {
    crypto() {
      this.updPrices = true
      setTimeout(() => { this.updPrices = false }, 500)
    }
  }
}
</script>

<style>
.cryptobar {
  display: grid;
  grid-template-columns: 1fr 1fr repeat(4, 3fr);
  padding: 5px;
  cursor: pointer;
  justify-items: left;
}

.cryptobar:hover {
  background-color: #e8e8e8;
}

.picked {
  background-color: #e8e8e8;
}

.logo {
  width: 20px;
  height: 20px;
}

.red-bcl {
  background-color: red;
  color: white;
}

.green-bcl {
  background-color: green;
  color: white;
}
</style>