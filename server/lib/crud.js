/**
 * Created by dell on 2018/2/8.
 */
/*商品录入的表*/
let shopList = require('../mouel/shopList');
/*实施记账的表*/
let billList = require('../mouel/billList');
/*商品编号列表*/
let shopID_list = require('../mouel/selectList_shopID');
/*用户列表*/
let userList = require('../mouel/userList');
//地图足迹列表
let mapPointLis = require('../mouel/map-point-list');


const BSf = require("../public/basic");
/*当前系统基本信息*/
let basicConfigList = require('../mouel/basicConfig');
let mongoose = require('mongoose');
let fsHandle = require("fs");
let JSV = require("JSV").JSV;
//使用mongoose链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/travelDiary');
//监听数据库连接状态-失败
mongoose.connection.on('error',function(error){
  console.log("数据库连接失败："+error);
});
//监听数据库连接状态-成功
mongoose.connection.on('open',function(){
  console.log("数据库链接成功！");
});

//创建JSV验证器环境
let validator = JSV.createEnvironment();
//当前支持的collections
let objTypeMap = {
  'shopList':shopList,//商品录入的表
  'billList':billList,//实施记账的表
  'shopIDList':shopID_list,//商品编号表
  'userList':userList,//用户信息表格
  'basicConfig':basicConfigList,//系统基础信息表
  'mapPointList': mapPointLis //地图足迹列表
};
//加载schema
let loadSchema = function(schema_name,schema_path){
  fsHandle.readFile(schema_path,'utf8',function(err,data){
    //获取文件中的数据，由json字符串转换成对象
    objTypeMap[schema_name] = JSON.parse(data);
  });
};
/**********************************************
 * 方法说明：验证器方法
 * 参数：
 * obj_type：要验证schema的名字（collection的名称）
 * obj_map：需要验证的对象
 * callback：回调函数
 * ******************************************/
let checkSchema = function(obj_type,obj_map,callback){
  let schema_map = objTypeMap[obj_type];
  //校验数据
  let report_map = validator.validate(obj_map,schema_map);
  //把错误数据传入回调函数
  callback(report_map.errors);
};

/**********************************************
 * 方法说明：在连接mongodb时执行该方法，保证在服务器启动时，所有用户被标记为离线状态
 * 方法名：clearIsOnline
 * ******************************************/
let clearIsOnline = function(){
  //todo
};

/**********************************************
 * 方法说明：检查对象类型，是否是模块支持的（当前仅支持urser）
 * 参数：
 * @params1：collection-collection的名称
 * 方法名：checkType
 * ******************************************/
const checkCollection = (collection)=>{
  if(!objTypeMap[collection]){
    return {
      error_msg: `不支持${collection}`
    }
  }
  return null;
};



/**********************************************
 * 方法说明：创建数据
 * 方法名：creareObj
 * 参数：
 * collection: collection的名称
 * obj_map:数据库的创建数据
 * callback:回调函数
 * ******************************************/
const creareObj = (collection,obj_map,callback)=>{
  //检验请求数据模块类型是否存在
  const type_check_map = checkCollection(collection);
  if(type_check_map){
    callback(type_check_map);
    return;
  }
  objTypeMap[collection].create(obj_map).then(res=>{
    callback({
      ok: true,
      message: "添加数据成功。"
    });
  }).catch(error=>{
    callback({
      ok: false,
      message: error
    });
  });
}

/**********************************************
 * 方法说明：获取数据
 * 方法名：readObj
 * 参数：
 * collection:要验证schema的名字（collection的名称）
 * find_map:通过此参数在数据库中查询到符合条件的数据
 * set_map:客户端向服务器发送的数据，用于数据库的创建数据
 * callback:回调函数
 * ******************************************/
let readObj = async (collection,find_map,callback) => {
  //通过id、内容查询
  //检验请求数据模块类型是否存在
  let type_check_map = checkCollection(collection);
  if(type_check_map){
    callback(type_check_map);
    return;
  }
  let searchObj = {};
  /*用于指定类型的查询功能*/
  if(Object.prototype.toString.call(find_map) =="[object Array]")
  {
    /*多条件查询*/
    let findLen = find_map.length;
    searchObj.$and =[];//实现与查询
    for(let i=0;i<findLen;i++){
      if(find_map[i].type){
        searchObj.$and.push({
          [find_map[i].type]:find_map[i].value
        });
      }
      //增加日期查询条件
      if(find_map[i].start && find_map[i].end){
        let start_year = find_map[i].start.year;
        let start_month = find_map[i].start.month-1;
        let start_date = find_map[i].start.date;
        let end_year = find_map[i].end.year;
        let end_month = find_map[i].end.month-1;
        let end_date = find_map[i].end.date;
        /*大于起始日期*/
        searchObj.$and.push({
          timeDate:{
            $gte:new Date(start_year,start_month,start_date)
          }
        });
        /*小于终止日期*/
        searchObj.$and.push({
          timeDate:{
            $lte:new Date(end_year,end_month,end_date)
          }
        })
      }
    }
  }
  else{
    //单条件查询（根据用户条件来查询）
    if(find_map.type){
      let type =find_map.type;
      searchObj = {
        [type]:find_map.value
      };
    }
  }
  let response ={};
  try {
    const result = await objTypeMap[collection].find(searchObj);
    response.ok = true;
    response.message = "查询成功。";
    response.data =result;
    callback(response);
  } catch (error) {
    response.ok = false;
    response.message = error;
    response.data = [];
    callback(response);
  }
};




/**********************************************
 * 方法说明：更新数据
 * 方法名：updateObj
 * 参数：
 * obj_type:要验证得先schema的名字（collection的名称）
 * find_map:通过此参数在数据库中查询到需要更新的数据
 * set_map:客户端向服务器发送的数据，更新后的数据
 * callback:回调函数
 * ******************************************/
let updateObj = function(obj_type,find_map,set_map,callback){
  //检验请求数据模块类型是否存在
  let type_check_map = checkCollection(obj_type);
  if(type_check_map){
    callback(type_check_map);
    return;
  }
// updateOne()方法用于更新单条记录。如果数据库中匹配到多条记录，只会更新第一条记录
//参考：https://www.python100.com/html/96064.html
  objTypeMap[obj_type].updateOne(find_map ,set_map).then(res=>{
    callback({
      ok: true,
      message: "更新数据成功。"
    });
  }).catch(error=>{
    callback({
      ok: false,
      message: error
    });
  });
};

/**********************************************
 * 方法说明：删除数据
 * 方法名：destroyObj
 * 参数：
 * obj_type:要验证得先schema的名字（collection的名称）
 * find_map:通过此参数在数据库中查询到需要删除的数据
 * callback:回调函数（错误的回调函数）
 * ******************************************/
let destroyObj = function(obj_type,find_map,callback){
    let type_check_map = checkCollection(obj_type);
    if(type_check_map){
      /*不支持的数据库列表*/
      callback(type_check_map);
      return;
    }
    //获取userID
    let userID = find_map.value;
    let len = find_map.data.length;
    let isStop = false;//停止删除的标示
    for(let i = 0;i<len;i++){
      let deletDataObj = {$and:[]};
      deletDataObj.$and.push({userID});
      deletDataObj.$and.push(find_map.data[i]);
      /*shop_id对于表中数据是唯一的*/
      objTypeMap[obj_type].remove(deletDataObj,function(err,data){
          if (err){
            callback(err);
            return;
          }
          if(i == len-1){
            //如果删除的是最后一条，就停止
            isStop = true;
          }
          data.isStop = isStop;
          if(obj_type == "shopList"){
            /*如果是商品录入时的删除，还应删除对应的商品编号*/
            let delte_shopID_obj = {
              $and:[]
            };
            delte_shopID_obj.$and.push({userID});
            delte_shopID_obj.$and.push({
              value:find_map.data[i].shop_id
            });
            shopIDList_dataFun('delete',delte_shopID_obj);
          }
          callback(data);
        });
    }
};

/*
* 功能说明：商品编号列表的增删改查
* */
let shopIDList_dataFun = function (type,data,callback) {
  switch (type){
    case 'add':
    {
      //查询当前用户的userID
      shopID_list.create(data);
      break;
    }
    case 'delete':
    {
      shopID_list.remove(data,function (err,data) {});
      break;
    }
    case "update":
    {
      shopID_list.update(data.find_map,data.set_map,function (err,data) {
        if(err){
          console.log(err);
        }
      });
      break;
    }
    default:
      break
  }
};

module.exports = {
  readObj:readObj,
  checkCollection : checkCollection,
  creareObj:creareObj,
  updateObj:updateObj,
  destroyObj:destroyObj
};
