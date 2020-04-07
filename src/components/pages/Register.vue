<template>
    <div>
        <van-nav-bar title="用户注册" left-text="返回" left-arrow @click-left="goBack" />

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
                <van-button type="primary" @click="registerAction" size="large">马上注册</van-button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "@/http.js";
    import url from "@/serviceAPI.config.js";
    import { Toast } from "vant";
    export default {
        data() {
            return {
                username: "",
                password: "",
                usernameErrorMsg: "", //当用户名出现错误的时候
                passwordErrorMsg: "" //当密码出现错误的时候
            };
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            registerAction() {
                this.checkForm() && this.axiosRegisterUser();
            },
            //*********axios注册用户方法********
            axiosRegisterUser() {
                let data = {};
                data.username = this.username;
                data.password = this.password;
                axios
                    .post(url.registerUser, data)
                    .then(res => {
                        if (res.data.code == 200 && res.data.message == "注册成功") {
                            Toast.fail(res.data.message);
                            this.$router.push("/");
                        } else if (res.data.code == 400 && res.data.message == "用户名已存在") {
                            Toast.fail(res.data.message);
                        } else {
                            Toast.fail("注册失败");
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