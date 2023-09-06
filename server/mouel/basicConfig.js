/*系统中基本配置：登录用户的信息和状态*/
/*请求数据库*/
let mongoose = require('mongoose');
/*创建schema映射到mongod数据库中的collection*/
let basicConfigSchema = new mongoose.Schema(
  {
    username:String,
    userID:Number,
    createTime:String,
    loginTime:String,
    isLogin:Boolean
  }, {
    collection: "basicConfig"//指定特定的collection
  });
//mongoose.model(`自定义名称`, Schema,文档名称(collections名称))
let basicConfig = mongoose.model('basicConfig',basicConfigSchema);
/*对外接口*/
module.exports = basicConfig;
