<template>
    <div>
        <div class="navbar-div">
            <van-nav-bar title="购物车" left-text="返回" left-arrow @click-left="goBack" />
        </div>
        <!--清空购物车-->
        <div class="card-title">
            <van-button size="small" type="danger" @click="clearCart" plain>清空购物车</van-button>
        </div>
        <!--显示购物车中的商品-->
        <div class="cart-list">
            <div
                class="pang-row"
                v-for="(item,index) in cartInfo"
                :key="index"
                @click="goToGoodsDetail(item)"
            >
                <div class="pang-img">
                    <img :src="item.image" width="100%" />
                </div>
                <div class="pang-text">
                    <div class="pang-goods-name">{{item.Name}}</div>

                    <div class="pang-control">
                        <van-stepper v-model="item.count" />
                    </div>
                </div>
                <div class="pang-goods-price">
                    <div>￥{{item.price |moneyFilter}}</div>
                    <div>x{{item.count}}</div>
                    <div class="allPrice">￥{{item.price*item.count | moneyFilter}}</div>
                </div>
            </div>
        </div>
        <!--显示总金额-->
        <div class="totalMoney">商品总价：￥ {{totalMoney | moneyFilter}}</div>
    </div>
</template>

<script>
    import { toMoney } from "@/filter/moneyFilter.js";
    export default {
        data() {
            return {
                cartInfo: [], //购物车内的商品
                isEmpty: false //购物车是否为空，不为空则显示true，为空显示false
            };
        },
        created() {
            this.getCartInfo();
        },
        filters: {
            moneyFilter(money) {
                return toMoney(money);
            }
        },
        computed: {
            totalMoney() {
                let allMoney = 0;
                this.cartInfo.forEach((item, index) => {
                    allMoney += item.price * item.count;
                });

                localStorage.cartInfo = JSON.stringify(this.cartInfo);

                return allMoney;
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            //得到购物车的商品
            getCartInfo() {
                //判断localStorage里是否有购物车数据
                if (localStorage.cartInfo) {
                    //如果有数据，我们去除并赋值给cartInfo
                    this.cartInfo = JSON.parse(localStorage.cartInfo);
                }
                //打印到控制台查看效果
                console.log(" this.cartInfo:" + JSON.stringify(this.cartInfo));
                this.isEmpty = this.cartInfo.length > 0 ? true : false;
            },
            //清空购物车的商品
            clearCart() {
                localStorage.removeItem("cartInfo");
                this.cartInfo = [];
            },
            goToGoodsDetail(item) {
                this.$router.push({
                    name: "Goods",
                    params: { goodsId: item.goodsId }
                });
            }
        }
    };
</script>

<style scoped>
    .card-title {
        height: 2rem;
        line-height: 2rem;
        background-color: #fff;
        border-bottom: 1px solid #e4e7ed;
        padding: 5px;
        text-align: right;
    }
    .cart-list {
        background-color: #fff;
    }
    .pang-row {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        padding: 0.5rem;
        font-size: 0.85rem;
        border-bottom: 1px solid #e4e7ed;
    }
    .pang-img {
        flex: 6;
    }
    .pang-text {
        flex: 14;
        padding-left: 10px;
    }
    .pang-control {
        padding-top: 10px;
    }
    .pang-goods-price {
        flex: 4;
        text-align: right;
    }
    .totalMoney {
        text-align: right;
        background-color: #fff;
        border-bottom: 1px solid #e4e7ed;
        padding: 5px;
    }
</style>