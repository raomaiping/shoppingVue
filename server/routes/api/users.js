//@login & register
const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
//引入加密模块
const bcrypt = require("bcryptjs");

//引入User数据模型
const User = require("../../models/User");

// 引入验证方法
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//引入jwt实现token
const jwt = require("jsonwebtoken");

//引入passport实现token验证
const passport = require("passport");

// $route  GET  api/users/test
// @desc   返回的请求的json数据
// @access public
router.get("/test", (req, res) => {
    res.json({ msg: "login works" })
})

// $route  POST  api/users/register
// @desc   返回的请求的json数据
// @access public
router.post("/register", (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // 判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }
    //查询数据库中用户名是否存在
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                return res.json({ code: 400, message: "用户名已存在" });
            } else {
                const newUser = new User(req.body)

                //加密
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(() => res.json({ code: 200, message: "注册成功" }))
                            .catch(err => res.status(500).json({ code: 500, message: '服务器错误', err: err }));
                    });
                });
            }
        })
})


// $route  POST  api/users/login
// @desc   返回token jwt passport
// @access public
router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // 判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const username = req.body.username;
    const password = req.body.password;

    //查询数据库
    User.findOne({ username })
        .then(user => {

            if (!user) {
                return res.json({code:400,message:'账号或密码错误'});
            }
            //密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //定义加密规则
                        const rule = {
                            id: user.id,
                            username:user.username,
                            date: Date.now
                        };

                        // jwt.sign("规则","加密名字","过期时间","箭头函数");
                        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 * 24 }, (err, token) => {
                            if (err) throw err;
                            res.json({
                                code:200,
                                message:"登录成功",
                                success: true,
                                token: "Bearer " + token
                            });
                        });
                    } else {
                        return res.json({code:400,message:'账号或密码错误'});
                    }
                })
        })
})


// $route  GET  api/users/current
// @desc   return current user
// @access Private
// router.get("/current",passport.authenticate("jwt",{session:false}),(req,res) => {
//     res.json({
//         id:req.user.id,
//         name:req.user.name,
//         email:req.user.email,
//         identity:req.user.identity
//     });
// })

module.exports = router;