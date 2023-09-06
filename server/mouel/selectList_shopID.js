/*商品编号下拉框*/
/*请求数据库*/
let mongoose = require('mongoose');
/*创建schema映射到mongod数据库中的collection*/
let shopIDListSchema = new mongoose.Schema(
  {
      value:String,
      text:String,
      isSelected:Boolean,
      purchasePrice:Number,
      userID:Number/*用户ID*/
  }, {
    collection: "shopIDList"//指定特定的collection
  });
//mongoose.model(`自定义名称`, Schema,文档名称(collections名称))
let shopIDList = mongoose.model('shopIDList',shopIDListSchema);
/*对外接口*/
module.exports = shopIDList;
