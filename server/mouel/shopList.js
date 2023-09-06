/**
 * Created by dell on 2018/1/27.
 */

let mongoose = require('mongoose');
//schema映射mongod数据库中的collection
let shopListSchema = new mongoose.Schema(
  {
    shop_id:String,/*商品ID*/
    shopName: String,/*名称*/
    shopNumber:String,/*商品总个数*/
    surplusShop:String,/*剩余商品个数*/
    shopPrice:String,/*进价（单价）*/
    bossName:String,/*联系人名称*/
    bossPhone:String,/*联系人电话*/
    info:String,/*备注*/
    adress:String,/*详细地址*/
    sour:Object,/*货源地*/
    userID:Number,/*用户ID*/
    time:{
      year : Number,
      month : Number,
      date : Number
    },
    timeDate:String//进货时间
  },
  {
    collection: "shopList"//指定特定的collection
});
/*Model的实例是document。内置实例方法如 save，可以通过methods属性给实例自定义扩展方法*/
shopListSchema.methods.methodFunc = function() {
    // body...
};
/*model的静态方法很多，如find，update等，可以通过 statics属性给 Model 添加自定义扩展方法*/
shopListSchema.statics.staticFunc = function() {
    // body...
};
//mongoose.model(`自定义名称`, Schema,文档名称(collections名称))
let shopList = mongoose.model('shoplist',shopListSchema);
//对外方法
module.exports = shopList;
