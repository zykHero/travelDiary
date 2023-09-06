/*实施记账所需要的表*/
/*请求数据库*/
let mongoose = require('mongoose');
/*创建schema映射到mongod数据库中的collection*/
let billListSchema = new mongoose.Schema(
  {
      /*键*/
    id:String,/*每一条记录的id，唯一标示，用于删除*/
    shop_id:String,/*商品编号*/
    shopName:String,/*商品名称*/
    purchasePrice:Number,/*进价*/
    sellingPrice:Number,/*售价（单价）*/
    shopNumber:Number,/*商品个数*/
    time:{
        year : Number,
        month : Number,
        date : Number
    },
    timeDate:String,
    info:String,/*备注*/
    userID:Number/*用户ID*/
  }, {
  collection: "billList"//指定特定的collection
});
//mongoose.model(`自定义名称`, Schema,文档名称(collections名称))
let billList = mongoose.model('billList',billListSchema);
/*对外接口*/
module.exports = billList;
