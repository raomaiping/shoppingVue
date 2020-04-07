const Validator = require('validator');
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if(!Validator.isLength(data.username,{min:5,max:30})){
    errors.username = "名字的长度不能小于5位并且不能大于30位!";
  }

  if(Validator.isEmpty(data.username)){
    errors.username = "名字不能为空!";
  }

  if(Validator.isEmpty(data.password)){
    errors.password = "密码不能为空!";
  }

  if(!Validator.isLength(data.password,{min:6,max:30})){
    errors.password = "密码的长度不能小于6位并且不能大于30位!";
  }

  return {
    errors,
    isValid:isEmpty(errors)
  };
}