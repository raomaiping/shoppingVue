<template>
    <div>
        <!--search bar layout-->
        <div class="search-bar">
            <van-row>
                <van-col span="2">
                    <img :src="locationIcon" width="80%" class="location-icon" />
                </van-col>
                <van-col span="18">
                    <input type="text" class="search-input" />
                </van-col>
                <van-col span="4">
                    <van-button size="mini">搜索</van-button>
                </van-col>
            </van-row>
        </div>
        <!--swipwer area-->
        <div class="swiper-area">
            <van-swipe :autoplay="1000">
                <van-swipe-item v-for="(banner,index) in bannerPicArray" :key="index">
                    <img v-lazy="banner.image" width="100%" />
                </van-swipe-item>
            </van-swipe>
        </div>

        <!-- type-bar -->
        <div class="type-bar">
            <div v-for="(cate,index) in category" :key="index">
                <img v-lazy="cate.image" width="80%" />
                <span>{{cate.mallCategoryName}}</span>
            </div>
        </div>

        <!--AD banner area-->
        <div class="ad-banner">
            <img v-lazy="adBanner.PICTURE_ADDRESS" width="100%" />
        </div>

        <!--Recommend goods area-->
        <div class="recommend-area">
            <div class="recommend-title">商品推荐</div>
            <div class="recommend-body">
                <!--swiper-->
                <Swiper :options="swiperOption">
                    <SwiperSlide
                        v-for=" (item ,index) in recommendGoods"
                        :key="index"
                        style="{touch-action: none;}"
                    >
                        <div class="recommend-item">
                            <img :src="item.image" width="80%" />
                            <div>{{item.goodsName}}</div>
                            <div>￥{{item.price | moneyFilter}} (￥{{item.mallPrice | moneyFilter}})</div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>

        <!--floor one area-->
        <floorComponent :floorData="floor1" :floorTitle="floorName.floor1"></floorComponent>
        <floorComponent :floorData="floor2" :floorTitle="floorName.floor2"></floorComponent>
        <floorComponent :floorData="floor3" :floorTitle="floorName.floor3"></floorComponent>

        <!--Hot Area-->
        <div class="hot-area">
            <div class="hot-title">热卖商品</div>
            <div class="hot-goods">
                <!--这里需要一个list组件-->
                <van-list>
                    <van-row gutter="20">
                        <van-col span="12" v-for="( item, index) in hotGoods" :key="index">
                            <goods-info
                                :goodsImage="item.image"
                                :goodsName="item.name"
                                :goodsPrice="item.price"
                                :goodsId="item.goodsId"
                            ></goods-info>
                        </van-col>
                    </van-row>
                </van-list>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "@/http.js";
    import { Swiper, SwiperSlide } from "vue-awesome-swiper";
    import floorComponent from "../component/floorComponent";
    import { toMoney } from "@/filter/moneyFilter.js";
    import "swiper/css/swiper.css";
    import goodsInfo from "../component/goodsInfoComponent";
    import url from "@/serviceAPI.config.js";
    export default {
        data() {
            return {
                swiperOption: {
                    slidesPerView: 3
                },
                locationIcon: require("../../assets/images/location.png"),
                bannerPicArray: [],
                category: [],
                adBanner: "",
                recommendGoods: [],
                floor1: [], //楼层1的数据
                floor2: [], //楼层2的数据
                floor3: [], //楼层3的数据
                floorName: {},
                hotGoods: [] //热卖商品
            };
        },
        components: {
            Swiper,
            SwiperSlide,
            floorComponent,
            goodsInfo
        },
        created() {
            axios
                .get(url.getShoppingMallInfo)
                .then(res => {
                    console.log(res);
                    if (res.status == 200) {
                        this.category = res.data.data.category;
                        this.bannerPicArray = res.data.data.slides;
                        this.adBanner = res.data.data.advertesPicture; //获得广告图片
                        this.recommendGoods = res.data.data.recommend; //推荐商品
                        this.floor1 = res.data.data.floor1; //楼层1数据
                        this.floor2 = res.data.data.floor2; //楼层2数据
                        this.floor3 = res.data.data.floor3; //楼层3数据
                        this.floorName = res.data.data.floorName;
                        this.hotGoods = res.data.data.hotGoods; //热卖商品
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        filters: {
            moneyFilter(money) {
                return toMoney(money);
            }
        }
    };
</script>
<style scoped>
    .search-bar {
        display: flex;
        align-items: center;
        height: 2.2rem;
        background-color: #e5017d;
    }
    .search-input {
        width: 96%;
        height: 1.3rem;
        border-top: 0px;
        border-left: 0px;
        border-right: 0px;
        border-bottom: 1px solid #fff !important ;
        background-color: #e5017d;
        color: #fff;
        margin-right: 0.2rem;
    }
    .swiper-area {
        max-height: 15rem;
        clear: both;
        overflow: hidden;
    }
    .type-bar {
        background-color: #fff;
        margin: 0 0.3rem 0.3rem 0.3rem;
        border-radius: 0.3rem;
        font-size: 14px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }
    .type-bar div {
        padding: 0.3rem;
        font-size: 12px;
        text-align: center;
    }
    .recommend-area {
        background-color: #fff;
        margin-top: 0.3rem;
        touch-action: none;
    }
    .recommend-title {
        border-bottom: 1px solid #eee;
        font-size: 14px;
        padding: 0.2rem;
        color: #e5017d;
    }
    .recommend-body {
        border-bottom: 1px solid #eee;
    }

    .recommend-item {
        width: 99%;
        border-right: 1px solid #eee;
        font-size: 12px;
        text-align: center;
    }
    .hot-area {
        text-align: center;
        font-size: 14px;
        /* height: 1.8rem; */
        line-height: 1.8rem;
    }
    .hot-goods {
        height: 130rem;
        margin-bottom: .5rem;
        overflow: hidden; 
        background-color: #fff; 
    }
</style>
