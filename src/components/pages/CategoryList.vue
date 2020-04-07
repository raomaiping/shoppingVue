<template>
    <div>
        <div class="navbar-div">
            <van-nav-bar title="类别列表" />
        </div>

        <div>
            <van-row>
                <van-col span="6">
                    <div id="leftNav">
                        <ul>
                            <li
                                @click="clickCategory(index,item.ID)"
                                :class="{categoryActive:categoryIndex==index}"
                                v-for="(item,index) in category"
                                :key="index"
                            >{{item.MALL_CATEGORY_NAME}}</li>
                        </ul>
                    </div>
                </van-col>
                <van-col span="18">
                    <!-- {{categorySub}} -->
                    <div class="tabCategorySub">
                        <van-tabs v-model="active" @click="onClickCategorySub">
                            <van-tab
                                v-for="(item, index) in categorySub"
                                :key="index"
                                :title="item.MALL_SUB_NAME"
                            ></van-tab>
                        </van-tabs>
                    </div>

                    <div id="list-div">
                        <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
                            <van-list v-model="loading" :finished="finished" @load="onLoad">
                                <div
                                    class="list-item"
                                    v-for="(item,index) in goodList"
                                    :key="index"
                                    @click="goGoodsInfo(item.ID)"
                                >
                                    <div class="list-item-img">
                                        <img :src="item.IMAGE1" width="100%" :onerror="errorImg" />
                                    </div>
                                    <div class="list-item-text">
                                        <div>{{item.NAME}}</div>
                                        <div class>￥{{item.ORI_PRICE | moneyFilter}}</div>
                                    </div>
                                </div>
                            </van-list>
                        </van-pull-refresh>
                    </div>
                </van-col>
            </van-row>
        </div>
    </div>
</template>

<script>
    import axios from "@/http.js";
    import url from "@/serviceAPI.config.js";
    import { Toast } from "vant";
    import { toMoney } from "@/filter/moneyFilter.js";
    export default {
        data() {
            return {
                category: [],
                categoryIndex: 0,
                active: 0,
                categorySub: [],
                list: [], //商品数据
                loading: false, //上拉加载使用
                finished: false, //上拉加载是否没有数据了
                isRefresh: false, //下拉加载
                page: 1, //商品列表的页数
                goodList: [], //商品信息
                categorySubId: "", //商品子分类ID
                errorImg:
                    'this.src="' + require("@/assets/images/errorimg.png") + '"' //错误图片显示路径
            };
        },
        created() {
            this.getCategory();
        },
        mounted() {
            let winHeight = document.documentElement.clientHeight;
            document.getElementById("leftNav").style.height = winHeight - 46 -50 + "px";
            document.getElementById("list-div").style.height =
                winHeight - 90 -50+ "px";
        },
        filters: {
            moneyFilter(money) {
                return toMoney(money);
            }
        },
        methods: {
            goGoodsInfo(id) {
                this.$router.push({ name: "Goods", params: { goodsId: id } });
            },
            //获取大类列表
            getCategory() {
                axios(url.getCategoryList)
                    .then(res => {
                        if (res.data.code == 200 && res.data.data) {
                            this.category = res.data.data;
                            this.getCategorySubByCategoryId(this.category[0].ID);
                        } else {
                            Toast("服务器错误");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            //点击大类的方法
            clickCategory(index, categoryId) {
                this.categoryIndex = index;
                this.page = 1;
                this.finished = false;
                this.goodList = [];
                this.getCategorySubByCategoryId(categoryId);
            },
            //根据大类ID读取小类类别列表
            getCategorySubByCategoryId(categoryId) {
                axios(url.getCategorySubList + categoryId)
                    .then(res => {
                        console.log(res);

                        if (res.data.code == 200 && res.data.data) {
                            this.categorySub = res.data.data;
                            console.log(this.categorySub);
                            this.active = 0;
                            this.categorySubId = this.categorySub[0].ID;
                            this.onLoad();
                        } else {
                            Toast("服务器错误，数据取得失败");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        Toast("网络错误");
                    });
            },
            getGoodList() {
                axios
                    .post(url.getGoodsListByCategorySubID, {
                        categorySubId: this.categorySubId,
                        page: this.page
                    })
                    .then(res => {
                        console.log(res);
                        if (res.data.code == 200 && res.data.data.length) {
                            this.page++;
                            this.goodList = this.goodList.concat(res.data.data);
                        } else {
                            this.finished = true;
                        }
                        this.loading = false;
                        console.log(this.finished);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            onLoad() {
                setTimeout(() => {
                    this.categorySubId = this.categorySubId
                        ? this.categorySubId
                        : this.categorySub[0].ID;
                    this.getGoodList();
                }, 1000);
            },
            onRefresh() {
                setTimeout(() => {
                    this.isRefresh = false;
                    this.finished = false;
                    this.goodList = [];
                    this.page = 1;
                    this.onLoad();
                }, 500);
            },
            //点击子类获取商品信息
            onClickCategorySub(index, title) {
                //console.log( this.categorySub)
                this.categorySubId = this.categorySub[index].ID;
                console.log(this.categorySubId);

                this.goodList = [];
                this.finished = false;
                this.page = 1;
                this.onLoad();
            }
        }
    };
</script>

<style  scoped>
    #leftNav {
        background-color: aliceblue;
    }
    #leftNav ul li {
        line-height: 2rem;
        border-bottom: 1px solid #e4e7ed;
        padding: 3px;
        font-size: 0.8rem;
        text-align: center;
    }
    .categoryActive {
        background-color: #eee;
    }
    .list-item {
        display: flex;
        flex-direction: row;
        font-size: 0.8rem;
        border-bottom: 1px solid #f0f0f0;
        background-color: #fff;
        padding: 5px;
    }
    #list-div {
        overflow: scroll;
    }
    .list-item-img {
        flex: 8;
    }
    .list-item-text {
        flex: 16;
        margin-top: 10px;
        margin-left: 10px;
    }
</style>