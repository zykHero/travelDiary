/*用户列表下拉框*/
/*请求数据库*/
let mongoose = require('mongoose');
/*创建schema映射到mongod数据库中的collection*/
let userListSchema = new mongoose.Schema(
  {
    userID:Number,
    username:String,
    password:String,
    createTime:String,
    loginTime:String,
    isLogin:Boolean ,//是否登陆
    remberPassword:Boolean
  }, {
    collection: "userList"//指定特定的collection
  });
//mongoose.model(`自定义名称`, Schema,文档名称(collections名称))
let userList = mongoose.model('userList',userListSchema);
/*对外接口*/
module.exports = userList;
