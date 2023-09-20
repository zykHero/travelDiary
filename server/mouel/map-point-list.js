/*地图足迹点列表*/
/*请求数据库*/
let mongoose = require('mongoose');
/*创建schema映射到mongod数据库中的collection*/
let mapPointListSchema = new mongoose.Schema(
  {
    userID:Number,
    date: String,
    address: Array,
    notes: String
  }, {
    collection: "mapPointList"//指定特定的collection
  });
//mongoose.model(`自定义名称`, Schema,文档名称(collections名称))
let mapPointLis = mongoose.model('mapPointList',mapPointListSchema);
/*对外接口*/
module.exports = mapPointLis;
