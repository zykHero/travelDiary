'use strict';
const express = require("express"),
      app = express(),
      http = require("http"),
      bodyParser = require("body-parser"),
      server = http.createServer(app),//创建http服务
      routes = require("./server/lib/routers"),//请求路由文件
      /*使用session*/
      cookieParser =require("cookie-parser"),
      session = require("express-session");
/*通过express的use调用中间件*/
  app.use(bodyParser());
  app.use(bodyParser.json());
  //托管静态文件
  app.use(express.static(__dirname+'/dist'));
  /*配置session  参考：https://zhuanlan.zhihu.com/p/409813376*/
  app.use(cookieParser());
  app.use(session({
    secret : "zyk",//类似秘钥
    name : "billsys_userID",//区分此系统的session
    cookie :{
      //todo 优化
      maxAge:12*60*60*1000
    },
    //是指每次请求都重新设置session cookie，
    // 假设你的cookie是6000毫秒过期，每次请求都会再设置6000毫秒。
    resave :false,
    //是指无论有没有session cookie，每次请求都设置个session cookie
    // 默认给个标示为 connect.sid
    saveUninitialized :true/*,
    //生成sessionID
    genid: function (req) {
      return req.query.userID; // 生成session的id
    }*/
  }));
/*设置路由*/
routes.configRoutes(app,server);
/*开启服务，监听端口*/
server.listen(3000,function(){
  console.log("连接成功！web请访问localhost:3000");
});
