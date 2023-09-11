/**
 * Created by dell on 2023/9/14.
 * 功能说明：路由模块
 */
'use strict';
//使用mongoose操作mongodb数据库
const mongoose = require('mongoose');
const NodeRSA = require("node-rsa"); 
//json 验证器
const JSV = require('JSV').JSV;
const BSf = require("../public/basic");
const crud = require("./crud.js");
const httpBaseHref = '/api';

/************************************************
 * 参数 ：
 * app：框架对象（eg：express()）
 * server：创建http服务
 * **********************************************/
let configRoutes = function(app,server){
  const key = new NodeRSA({b: 2048});  //2048 密钥长度
  key.setOptions({ encryptionScheme: 'pkcs1' });//指定加密格式  不改格式得话可能会报错
   
  const publicKey = key.exportKey("pkcs8-public-pem");//公钥
  const privateKey =  key.exportKey('pkcs8-private-pem'); //私钥
  

  /*使用express的get方法定义路由*/
  app.get('/',function(require,response){
    //todo服务器打开窗口的方法
  });
  /*拦截所有的CRUD到达路由（包括get、post类型），设置CRUD中公共的处理，然后继续next()*/
  app.all(`/:obj_type/*?`,function(request,response,next){
    response.contentType('json');//统一处理CRUD共同的设置
    next();//继续后续的CRUD路由
  });

  /*
   * 方法描述：todo 获取加密publickey
   * 详细描述：通过
   * */

  app.get(`${httpBaseHref}/publicKey`, (request,response)=> {
    response.end(publicKey);
  });


  /*
   * 方法描述：登录接口
   * 详细描述：实现用户登录、向session中存放userID
   * */
  app.post(`${httpBaseHref}/login`, (request,response)=> {
      let data = request.body;
      let name = data.username;
      key.importKey(privateKey);//导入私钥
      const password = key.decrypt(data.password, 'utf8');
      console.log('password', password);
      //在用户列表中查询
      let obj_type ="userList";
      let searchObj = {
        type:"username",
        value:name
      };
      let responseObj = {};//向客户端传递的结果
      crud.readObj(obj_type,searchObj,(data)=> {
        if(data.ok && data.data.length === 1)
        {
          //查找到对应的用户，再判断密码是否正确
          if(data.data[0].password === password)
          {
            /*session中存储userID*/
            request.session.userName = name;
            request.session.userID = data.data[0].userID;
            request.session.isLogin =true;
            /*登陆成功之后，更新userLogin中的登陆状态*/
            let findMap = {
              username:name,
              userID: data.data[0].userID
            };
            let loginTime = new Date();
            let setMap ={
              loginTime:loginTime,
              isLogin:true
            };
            crud.updateObj( obj_type,findMap,setMap,function (response_update) {
              let responseObj = {};
              if(response_update.ok){
                responseObj.ok = true;
                responseObj.message = "登陆成功";
                response.send(responseObj);
              }
            });
          }
          else
          {
            responseObj.ok = false;
            responseObj.message = "登陆失败";
            response.send(responseObj);
          }
        }
        else
        {
          /*查找不到用户名*/
          responseObj.ok = false;
          responseObj.message = "登陆失败";
          response.send(responseObj);
        }
      });
  });







  /*退出请求*/
  app.post('/logout',function (request,response) {
    let data = request.body;
    let find_data = {
      username:data.userName
    };
    let object_type = 'userList';
    let setData = {
      loginTime:"",
      isLogin:false
    };
    /*退出系统时，修改用户列表对应的用户的登陆状态和登陆时间*/
    crud.updateObj(object_type,find_data,setData,function(response_update){
      let responseObj = {};
      if(response_update.ok){
        /*todo 销毁session*/
        request.session.userName=  "";
        request.session.userID= "";
        request.session.isLogin =false;
        responseObj.ok = true;
        responseObj.message = "退出成功。";
      }else {
        responseObj.ok = false;
        responseObj.message = "退出失败。";
      }
      response.send(responseObj);
    })
  });

  
  /*注册界面路由*/
  app.post("/createUser",function (request,response) {
    let data = request.body;
    //定义查询的表名称
    let obj_type ="userList";
    let searchObj = {
      type:"username",
      value: data.username
    };
    /*进行查询，如果有相同名字的，进行提示*/
    crud.readObj(obj_type,searchObj,function(resData){
      let responseObj = {};
      if(resData.data.length ==0){
        let callbck =function (userId) {
          data.userID = userId;
          data.createTime = new Date();//创建用户时间
          data.loginTime = "";//登陆数据默认为空
          data.isLogin = false;//登陆状态为false
          crud.creareObj(obj_type,data,function(text){
            response.send(text);
          });
        };
        BSf.createOnlyID("userList","userID",callbck);
      }else{
        responseObj.ok = false;
        responseObj.message = "用户已存在。";
        response.send(responseObj);
      }
    });
  });
  /*获取表格的数据（商品列表）-get方式*/
  app.get('/:obj_type/list?*',function(request,response){
    //argumens[0]:表名字，arguments[1]:获取数据之后回调函数
    //连接数据库
    let obj_type = request.params.obj_type,
         findObj = {};
    /*从session中获取userID，通过userID找到对应表格中的数据*/
    let userID = request.session.userID;
    findObj.type = "userID";
    findObj.value = userID;
    crud.readObj(obj_type,findObj,function(find_data){
      response.send(find_data);
    });
  });
  /*添加创建用户对象的路由 - post*/
  app.post('/:obj_type/create',function(request,response){
    //向user中插入数据
    let cmddata = request.body;
    //schema表名
    let obj_type = request.params.obj_type;
    /*从session中获取userID，通过userID找到对应表格中的数据*/
    cmddata.userID = request.session.userID;
    if(obj_type == "billList"){
      cmddata.id = BSf.createOnlyID(obj_type,"id");
    }
    //商品录入时
    crud.creareObj(obj_type,cmddata,function(text){
      response.send(text);
    });
  });
  /*添加读取用户对象路由,路由中可以添加正则，如以下，id仅为数字并且至少一个*/
  app.post('/:obj_type/read',function(request,response){
    //require.params 客户端请求的参数字段对象
    let data = request.body;
    //schema表名
    let obj_type = request.params.obj_type;
    let findData;
    if(request.session.userID !=undefined){
      findData = [].concat(data);
      findData.push({
        type: "userID",
        value: request.session.userID
      });
    }else{
      findData = data;
    }
    crud.readObj(obj_type,findData,function(data){
      if(obj_type ==="userList"){
        data.data[0].password = "";
      }
      response.send(data);
    });
  });
  /*更新的路由(CRUD)*/
  app.post('/:obj_type/updated/',function(request,response){
    //向表格中更新数据的数据内容
    let data = request.body;
    /*从session中获取userID，通过userID找到对应表格中的数据*/
    let userID = request.session.userID;
    let find_map = {
      $and:[{
        'shop_id':data['shop_id']
      },{
        'userID':userID
      }]
    };
    //schema表名
    let obj_type = request.params.obj_type;
    //商品更新时
    crud.updateObj(obj_type,find_map,data,function(text){
      response.send(text);
    });
  });
  /*删除的路由(CRUD)*/
  app.post('/:obj_type/delete',function(request,response){
    let data = request.body;
    let obj_type = request.params.obj_type;
    /*从session中获取userID，通过userID找到对应表格中的数据*/
    let userID = request.session.userID;
    let deleteData = {
      type:"userID",
      value:userID,
      data:data
    };
    crud.destroyObj(obj_type,deleteData,function(text){
      if(text.isStop){
        response.send(text);
      }
    });
  });
  /*获取系统基本信息*/
  app.get('/getBasicInfo',function(request,response){
    //argumens[0]:表名字，arguments[1]:获取数据之后回调函数
    //连接数据库
    crud.readObj("basicConfig",{},function(data){
      response.send(data);
    });
  });

  /*获取session*/
  app.get('/session',function (request,response) {
    response.send({
      userID:request.session.userID,
      userName :request.session.userName,
      isLogin :request.session.isLogin
    });
  });
  /*报表涉及取数*/
  /*1-库存*/
  app.post('/report/store',function (request,response) {
    /*从session中获取userID*/
    let findObj = [];
    //default:默认返回最多的15个，search：返回指定的商品库存
    let request_type = request.body.type?request.body.type:"default";
    //获取请求库存的的个数,默认是15
    let request_number = request.body.number?request.body.number:15;
    //选择的商品库存名称
    let request_selectedStore = request.body.selectedStore?request.body.selectedStore:[];
    let obj_type = "shopList";
    let userID = request.session.userID;
    findObj.push({
      type :"userID",
      value : userID
    });
    //获取当前日期
    let currentDate = BSf.getCurrentDate();
    findObj.push({
      end:currentDate
    });
    //获取两年前的时间点
    findObj.push({
      start:{
        year:currentDate.year-2,
        month:currentDate.month,
        date : currentDate.date
      }
    });
    //查询当前用户下的商品（两年前至今的数据）
    crud.readObj(obj_type,findObj,function(find_data){
      let allStore = find_data.data;
      //格式化数据，把名称一样的商品的进货个数合并
      let allStoreObj = {};
      let allBillingData = {};//存放实时记账的对象
      let computerAllStore = function (arr,resObj) {
        let len = arr.length;
        if(len == 0){
          return
        }
        let splitArr = arr.splice(0,2);
        for(let i=0;i<splitArr.length;i++){
            if(!resObj[splitArr[i].shopName]){
              resObj[splitArr[i].shopName] = splitArr[i].shopNumber;
            }else{
              resObj[splitArr[i].shopName] = resObj[splitArr[i].shopName]*1+splitArr[i].shopNumber*1;
            }
        }
        computerAllStore(arr,resObj);
      };
      computerAllStore(allStore,allStoreObj);
      //查询实时记账时间段的数据
      let obj_type_billing = "billList";
      crud.readObj(obj_type_billing,findObj,function(respone_billingData){
        let billData = respone_billingData.data;
        //处理实时记账的数据
        computerAllStore(billData,allBillingData);
        //计算出剩余库存
        let currentStore = {};
        for(let j in allStoreObj){
          if(!allBillingData[j]){
            currentStore[j] = allStoreObj[j];
          }else{
            currentStore[j] = allStoreObj[j]-allBillingData[j];
          }
        }
        //对剩余库存进行递减排序
        let currentStore_arrt=[];
        for (let k in currentStore){
          currentStore_arrt.push({
            shopName : k,
            shopNumber : currentStore[k],
            isSelected:false
          });
        }
        //排序
        let sortArr = BSf.sortArr(currentStore_arrt,"down","shopNumber");
        if(request_type =="default"){
          //默认返回前15个数据是被选择的
          for(let i=0;i<sortArr.length;i++){
            if(i<request_number){
              sortArr[i].isSelected = true;
            }else {
              break;
            }
          }
        }else{
          let selectedArr = request_selectedStore.length;
          if(selectedArr ==0){
            //指定选择的数据
            for(let l=0;l<selectedArr;l++){
              for(let m =0;m<sortArr.length;m++){
                  if(request_selectedStore[l] ===sortArr[m].shopName){
                    sortArr[m].isSelected = true;
                    break;
                  }
              }
            }
          }
        }
        response.send(sortArr);
      });
    });
  });
};
module.exports = {
  configRoutes : configRoutes
};
