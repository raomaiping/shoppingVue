const express = require("express");
const router = express.Router();
const fs = require("fs")
const Goods = require("../../models/Goods")
const Category = require("../../models/Category")
const CategorySub = require("../../models/CategorySub")

//引入passport实现token验证
const passport = require("passport");

//插入商品详情数据
router.get('/insertAllGoodsInfo', (req, res) => {
    fs.readFile('./newGoods.json', function (err, data) {
        data = JSON.parse(data)
        let saveCount = 0
        data.map((value, index) => {
            console.log(value)
            let newGoods = new Goods(value)
            newGoods.save().then(() => {
                saveCount++
                console.log('成功' + saveCount);
            }).catch(err => {
                console.log(err);
            })
        })
    })
    res.json("开始导入数据")
})


//插入商品大类数据
router.get('/insertAllCategory', (req, res) => {
    fs.readFile('./data_json/category.json', function (err, data) {
        data = JSON.parse(data)
        let saveCount = 0
        data.RECORDS.map((value, index) => {
            console.log(value)
            let newCategory = new Category(value)
            newCategory.save().then(() => {
                saveCount++
                console.log('成功' + saveCount);
            }).catch(err => {
                console.log(err);
            })
        })
    })
    res.json("开始导入数据")
})


//插入商品小类数据
router.get('/insertAllCategorySub', (req, res) => {
    fs.readFile('./data_json/category_sub.json', function (err, data) {
        data = JSON.parse(data)
        let saveCount = 0
        data.RECORDS.map((value, index) => {
            console.log(value)
            let newCategorySub = new CategorySub(value)
            newCategorySub.save().then(() => {
                saveCount++
                console.log('成功' + saveCount);
            }).catch(err => {
                console.log(err);
            })
        })
    })
    res.json("开始导入数据")
})


//获取商品详情信息接口
router.get("/getDetailGoodsInfo/:id", (req, res) => {
    Goods.findOne({
        ID: req.params.id
    })
        .then(good => {
            if (!good) {
                return res.status(404).json("没有任何内容");
            }
            res.json({ code: 200, data: good })
        })
        .catch(err => res.status(500).json(err));
});

//获取商品大类信息接口
router.get("/getCategoryList", (req, res) => {
    Category.find().exec()
        .then(result => {
            if (!result) {
                return res.status(404).json("没有任何内容");
            }
            res.json({ code: 200, data: result })
        })
        .catch(err => res.status(500).json(err));
});

//获取商品小类信息接口
router.get("/getCategorySubList/:id", (req, res) => {
    CategorySub.find({
        MALL_CATEGORY_ID: req.params.id
    })
        .then(result => {
            if (!result) {
                return res.status(404).json("没有任何内容");
            }
            res.json({ code: 200, data: result })
        })
        .catch(err => res.status(500).json(err));
});


//获取商品类别获取商品列表
router.post("/getGoodsListByCategorySubID", (req, res) => {
    let categorySubId = req.body.categorySubId //小类别
    let page = req.body.page
    let num = 10 //每页显示数量
    let start = (page - 1) * num
    Goods.find({
        SUB_ID: categorySubId
    }).skip(start).limit(num).exec()
        .then(result => {
            if (!result) {
                return res.status(404).json("没有任何内容");
            }
            res.json({ code: 200, data: result })
        })
        .catch(err => res.status(500).json(err));
});

module.exports = router;