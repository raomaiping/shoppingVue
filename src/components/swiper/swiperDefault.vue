<template>
    <div>
        <Swiper>
            <SwiperSlide
                class="SwiperSlide"
                v-for="(item, index) in slide"
                :key="index"
            >Slide {{item}}</SwiperSlide>
        </Swiper>
    </div>
</template>

<script>
    import { Swiper, SwiperSlide } from "vue-awesome-swiper";
    import "swiper/css/swiper.css";
    export default {
        data() {
            return {
                slide: [1, 2, 3, 4, 5, 6]
            };
        },
        components: { Swiper, SwiperSlide }
    };
</script>

<style scoped>
.SwiperSlide {
    height: 4rem;
    text-align: center;
    padding-top: 3rem;
    border-bottom: 1px solid #ccc;
}
</style>