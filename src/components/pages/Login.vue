<template>
    <div>
        <van-nav-bar title="用户登录" left-text="返回" left-arrow @click-left="goBack" />

        <div class="register-panel">
            <van-field
                v-model="username"
                label="用户名"
                icon="clear"
                placeholder="请输入用户名"
                required
                @click-icon="username = ''"
                :error-message="usernameErrorMsg"
            />

            <van-field
                v-model="password"
                type="password"
                label="密码"
                placeholder="请输入密码"
                required
                :error-message="passwordErrorMsg"
            />
            <div class="register-button">
                <van-button type="primary" @click="LoginAction" size="large">登录</van-button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "@/http.js";
    import url from "@/serviceAPI.config.js";
    import { Toast } from "vant";
    import jwt_decode from "jwt-decode";
    export default {
        data() {
            return {
                username: "",
                password: "",
                usernameErrorMsg: "", //当用户名出现错误的时候
                passwordErrorMsg: "" //当密码出现错误的时候
            };
        },
        created() {
            if (localStorage.eleToken) {
                Toast.success("您已经登录过了");
                setTimeout(() => {
                    this.$router.push("/");
                }, 2000);
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            LoginAction() {
                this.checkForm() && this.axiosLoginUser();
            },
            //*********axios注册用户方法********
            axiosLoginUser() {
                let data = {};
                data.username = this.username;
                data.password = this.password;
                axios
                    .post(url.loginUser, data)
                    .then(res => {
                        if (
                            res.data.code == 200 &&
                            res.data.message == "登录成功"
                        ) {
                            Toast.fail(res.data.message);
                            const { token } = res.data;
                            localStorage.setItem("eleToken", token);
                            //解析token
                            const decoded = jwt_decode(token);
                            localStorage.setItem('UserId',JSON.stringify(decoded))
                            this.$router.push("/");
                        } else {
                            Toast.fail("账号或密码错误");
                        }
                    })
                    .catch(error => {
                        Toast.fail("网络错误");
                    });
            },
            checkForm() {
                let isOk = true;
                if (this.username.length < 5) {
                    this.usernameErrorMsg = "用户名不能少于5位";
                    isOk = false;
                } else {
                    this.usernameErrorMsg = "";
                }
                if (this.password.length < 6) {
                    this.passwordErrorMsg = "密码不能少于6位";
                    isOk = false;
                } else {
                    this.passwordErrorMsg = "";
                }
                return isOk;
            }
        }
    };
</script>

<style scoped>
    .register-panel {
        width: 96%;
        border-radius: 5px;
        margin: 20px auto;
        padding-bottom: 50px;
    }
    .register-button {
        padding-top: 10px;
    }
</style>