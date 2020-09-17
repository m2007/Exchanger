<template>
  <div class="container con-exchange">
    <div class="con-header">Exchange</div>
    <div class="con-exchange-bar">
      <input type="number" v-model="fromValue" v-on:keyup="count('from')">
      <select v-model="fromName" @change="changeFromCrypto">
        <option v-for="cname of allCryptosNames" :key="cname">{{cname}}</option>
        <option>USD</option>
        <option>EUR</option>
        <option>RUB</option>
      </select>
    </div>
    <div class="con-exchange-bar">
      <input type="number" v-model="toValue" v-on:keyup="count('to')">
      <select v-model="toName">
        <option v-for="cname of allCryptosNames" :key="cname">{{cname}}</option>
        <option>USD</option>
        <option>EUR</option>
        <option>RUB</option>
      </select>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "Exchange",
  props: ['pickedCrypto'],
  data: () => ({
    fromValue: 1,
    fromName: 'BTC',
    toValue: .0,
    toName: ''
  }),
  computed: {
    ...mapGetters(['allCryptos']),
    allCryptosNames() {
      let names = []
      for (let crypto of this.allCryptos) {
        names.push(crypto.name)
      }
      return names
    },
    pickedCryptoNums() {
      let temp = []
      if (this.allCryptosNames.includes(this.fromName)) temp.push(0)
      if (this.allCryptosNames.includes(this.toName)) temp.push(1)
      return temp
    }
  },
  watch: {
    fromName() {
      if (this.toName)
        this.count()
    },
    toName() {
      if (this.fromName)
        this.count()
    },
    pickedCrypto(newPick) {
      if (newPick) this.fromName = newPick
    }
  },
  methods: {
    changeFromCrypto() {
      this.$emit('changeFromCrypto')
    },
    count(change='from') {
      if (!this.toName || !this.fromName) return
      
      if (this.pickedCryptoNums.length == 2) {
        let currencyFrom = this.allCryptos.find(cr => cr.name == this.fromName).USD.PRICE
        let currencyTo = this.allCryptos.find(cr => cr.name == this.toName).USD.PRICE

        if (change == 'from')
          this.toValue = +(this.fromValue * (currencyFrom / currencyTo)).toFixed(10)
        else
          this.fromValue = +(this.toValue * (currencyTo / currencyFrom)).toFixed(10)

      } else if (this.pickedCryptoNums.length == 1) {
        if (change == 'from') {
          this.toValue = this.pickedCryptoNums[0] ? 
            +(this.fromValue / this.allCryptos.find(cr => cr.name == this.toName)[this.fromName].PRICE).toFixed(10)  : 
            +(this.fromValue * this.allCryptos.find(cr => cr.name == this.fromName)[this.toName].PRICE).toFixed(10) 
        } else {
          this.fromValue = this.pickedCryptoNums[0] ? 
            +(this.toValue * this.allCryptos.find(cr => cr.name == this.toName)[this.fromName].PRICE).toFixed(10) : 
            +(this.toValue / this.allCryptos.find(cr => cr.name == this.fromName)[this.toName].PRICE).toFixed(10)
        }
        
      } else {
        let btc = this.allCryptos.find(cr => cr.name == 'BTC')

        if (change == 'from') 
          this.toValue = this.fromValue * btc[this.toName].PRICE / btc[this.fromName].PRICE
        else
          this.fromValue = this.toValue * btc[this.fromName].PRICE / btc[this.toName].PRICE
      }
    }
  }
}
</script>

<style>
input {
  margin-right: 5px;
  -moz-appearance:textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.con-exchange-bar{
  margin-top: 10px;
}

select {
  height: 21px;
}
</style>