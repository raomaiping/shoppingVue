<template>
    <div>
        <div class="navbar-div">
            <van-nav-bar title="会员中心" />
        </div>
        <div class="userInfo" v-if="username">
            会员账号：{{username}}
            <van-button type="primary" size="large" class="btn" @click="exitLogin">退出登录</van-button>
        </div>
        <div v-else class="userInfo">
            游客
            <div class="btn">
                <van-button type="primary" @click="register">立即注册</van-button>
                <van-button type="primary" @click="login">立即登录</van-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: ""
            };
        },
        created() {
            this.getUserName();
        },
        methods: {
            getUserName() {
                if (localStorage.UserId) {
                    const user = JSON.parse(localStorage.UserId);
                    this.username = user.username;
                }
            },
            register() {
                this.$router.push("/register");
            },
            login() {
                this.$router.push("/login");
            },
            exitLogin() {
                //清除token
                localStorage.removeItem("eleToken");
                localStorage.removeItem("UserId");
                this.username = "";
            }
        }
    };
</script>

<style scoped>
    .userInfo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .btn {
        margin-top: 6rem;
    }
</style>