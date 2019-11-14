<template>
  <div>
    <Card>
      <div slot="title">
        <Button type="info" @click="showCartModal">购物车</Button>
      </div>
      <div>
        <div v-for="stuff in stuffs" :key="stuff.id">
          <Row>
            <i-col span="3">
              <img v-if="stuff.icon" style="width:80px;height:80px" :src="stuff.icon" />
              <img v-else style="width:80px;height:80px" :src="noImg" />
            </i-col>
            <i-col span="9">
              <h2 class="item-title">{{stuff.name}}</h2>
              <p class="item-description">{{stuff.desc}}</p>
            </i-col>
            <i-col span="3">
              <span style="color:red; margin-left:10px">￥&nbsp;&nbsp;</span> <strong style="color:red">{{stuff.price/100}}</strong>
            </i-col>
            <i-col span="3">
              <Button v-if="choseStuffs.indexOf(stuff.id) === -1" type="info" size="small" @click="addCart(stuff)">加入购物车</Button>
              <Button v-else type="success" size="small" @click="addCart(stuff)" disabled>已加购物车</Button>
            </i-col>
          </Row>
          <Divider />
        </div>
      </div>
    </Card>
  <Modal
      v-model="cartModal"
      title="购物清单"
      width="900"
      :loading="loading"
      ok-text="确认订单"
      cancel-text="继续选购"
      @on-ok="confirmOrder">
      <div class="cart">
        <Row v-for="item in items" :key="item.id">
          <i-col span="4">
            <img style="width:80px;height:80px" :src="noImg" key="no-img" />
          </i-col>
          <i-col span="12">
            <h2 class="item-title">{{item.name}}</h2>
            <p class="item-description">{{item.desc}}</p>
          </i-col>
          <i-col span="3">
            <span style="color:red; margin-left:10px">￥&nbsp;&nbsp;</span> <strong style="color:red">{{item.price/100}}</strong>
          </i-col>
          <i-col span="5">
            <InputNumber :max="10000" :min="1" v-model="item.num"></InputNumber><span class="item-price">/{{item.unit}}</span>
            <Icon type="md-close" size="16" color="red" @click="delItem(item)" style="margin-left:20px"/>
          </i-col>
        </Row>
        <h3 class="cart-line">
          收货人 <Input v-model="recName" placeholder="输入收货人..." style="width: 300px" />
        </h3>
        <h3 class="cart-line">
          收货地址 <Input v-model="recAddr" placeholder="输入收货地址..." style="width: 300px" />
        </h3>
        <h3 class="cart-line">
          收货人电话 <Input v-model="recTel" placeholder="输入收货人电话..." style="width: 300px" />
        </h3>
        <h3 class="cart-line">
          总价 <span class="cart-price cart-total">{{shippingPrice}}&nbsp;元</span>
        </h3>
      </div>
    </Modal>
  </div>
</template>

<script>
import noImg from '@/assets/images/noimg.png'
import { getStuff } from '@/api/machine'
import { addStuffOrder } from '@/api/order'
export default {
  name: 'replenish',
  data () {
    return {
      noImg,
      items: [],
      stuffs: [],
      choseStuffs: [],
      recName: '',
      recAddr: '',
      recTel: '',
      loading: true,
      cartModal: false
    }
  },
  computed: {
    shippingPrice: function () {
      let total = 0
      this.items.forEach(item => {
        total += item.price * item.num
      })
      return total / 100
    }
  },
  methods: {
    delItem (item) {
      this.choseStuffs.splice(this.choseStuffs.indexOf(item.id), 1)
      this.items.splice(this.items.indexOf(item), 1)
      this.$Message.success('删除原料成功')
      if (this.items.length === 0) {
        this.cartModal = false
      }
    },
    addCart (stuff) {
      this.items.push({
        id: stuff.id,
        name: stuff.name,
        price: stuff.price,
        unit: stuff.unit,
        desc: stuff.desc,
        num: 1
      })
      this.choseStuffs.push(stuff.id)
    },
    showCartModal () {
      if (this.items.length === 0) {
        this.$Message.error('购物车为空！')
        return
      }
      this.cartModal = true
    },
    confirmOrder () {
      let data = {
        rec_addr: this.recAddr,
        rec_name: this.recName,
        rec_tel: this.recTel,
        items: []
      }
      this.items.forEach(el => {
        data.items.push({
          id: el.id,
          num: el.num
        })
      })
      addStuffOrder(data).then(res => {
        this.$Message.success('提交成功')
        this.cartModal = false
        this.items = []
        this.choseStuffs = []
      })
    }
  },
  mounted () {
    getStuff().then(res => {
      this.stuffs = res
    })
  }
}
</script>

<style>
/* body {
  margin: 0;
  background: #fdca40;
  padding: 30px;
} */

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  text-transform: uppercase;
  font-size: 110%;
  font-weight: normal;
}

.items {
  margin: 0;
  padding: 0;
  list-style: none;
}

.cart {
  background: #fff;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  color: #333a45;
  border-radius: 3px;
  padding: 30px;
}
.cart-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 0 0;
  font-size: inherit;
  font-weight: normal;
  color: rgba(51, 58, 69, 0.8);
}
.cart-price {
  color: #333a45;
}
.cart-total {
  font-size: 130%;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 2px solid rgba(51, 58, 69, 0.1);
}
.item-preview {
  display: flex;
  align-items: center;
}
.item-thumbnail {
  margin-right: 20px;
  border-radius: 3px;
}
.item-title {
  margin: 0 0 10px 0;
  font-size: inherit;
}
.item-description {
  margin: 0;
  /* width: 500px ; */
  color: rgba(51, 58, 69, 0.6);
}
.item-quantity {
  max-width: 30px;
  padding: 8px 12px;
  font-size: inherit;
  color: rgba(51, 58, 69, 0.8);
  border: 2px solid rgba(51, 58, 69, 0.1);
  border-radius: 3px;
  text-align: center;
}
.item-price {
  margin-left: 20px;
}
</style>
