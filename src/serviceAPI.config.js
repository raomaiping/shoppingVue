const BASEURL = "http://rap2.taobao.org:38080/app/mock/247915/";
const LOCALURL = "http://localhost:5000/";
const URL = {
  getShoppingMallInfo: BASEURL + "index", //商城首页所有信息
  getGoodsInfo: BASEURL + "getGoodsInfo",
  registerUser: LOCALURL + "api/users/register", //用户注册接口
  loginUser: LOCALURL + "api/users/login", //用户登录接口
  getDetailGoodsInfo: LOCALURL + "api/goods/getDetailGoodsInfo/", //用户登录接口
  getCategoryList:LOCALURL+'api/goods/getCategoryList', //得到大类信息
  getCategorySubList:LOCALURL+'api/goods/getCategorySubList/',   //得到小类信息
  getGoodsListByCategorySubID:LOCALURL+'api/goods/getGoodsListByCategorySubID',   //得到小类商品信息
};

module.exports = URL;
