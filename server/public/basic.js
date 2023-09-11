/*公共基本方法*/
  const crud = require('../lib/crud');
  const NodeRSA = require("node-rsa"); 



  /*
  * 方法名称：createOnlyID
  * 功能描述：为用户创建有序的id
  * arguments:
  * */
  let createOnlyID = function (obj_type,key,callback) {
    console.log(crud)
    //定义查询的表名称
    let userIDArr = [];
    /*查询userList表，获取userID的数组*/
    crud.readObj(obj_type,{},function(resData)
    {
      let len = resData.data.length;
      if( len===0){
        /*如果当前没有用户，则创建第一个用户，id是0*/
        callback(0);
      }else{
        /*若是存在用户，则获取所有用户的userId，并且存入数组*/
        for(let i =0;i<len;i++){
          let obj = resData.data[i];
          userIDArr.push(obj[key]);
        }
        /*对userID进行排序，获取最大值*/
        let resArr = sortArr(userIDArr,"down");
        let resID = parseInt(resArr[0]+1);
        if(callback){
          callback(resID);
        }else{
          return resID;
        }
      }
    });
  };
  /*
    * 方法名：sortArr
    * 功能介绍：对数组进行排序（冒泡算法）
    * arguments:
    *   arr（必输项）：需要排序的数组；
    *   action（非必输项）："up"-升序，"down"-降序（默认）
    * */
  let sortArr = function (arr,action,objName) {
    /*判断需要排序的数据是否是数组*/
    if(Object.prototype.toString.call(arr) !='[object Array]'){
      return arr;
    }
    /*空数组或者数组1个元素，不需要排序直接跳出*/
    let len = arr.length;
    let temp;
    if(len <= 1){
      return arr;
    }
    for(let i=0;i<len-1;i++){
      for(let j=0;j<len-i-1;j++){
        if(action ==="up")
        {
          /*升序*/
          if(objName){
            if(arr[j][objName] > arr[j+1][objName]){
              temp = arr[j];
              arr[j] = arr[j+1];
              arr[j+1] =temp;
            }
          }else {
            if(arr[j]>arr[j+1]){
              temp = arr[j];
              arr[j] = arr[j+1];
              arr[j+1] =temp;
            }
          }
        }
        else
        {
          /*降序*/
          if(objName){
            if(arr[j][objName] < arr[j+1][objName]){
              temp = arr[j];
              arr[j] = arr[j+1];
              arr[j+1] =temp;
            }
          }else{
            if(arr[j]<arr[j+1]){
              temp = arr[j];
              arr[j] = arr[j+1];
              arr[j+1] =temp;
            }
          }
        }
      }
    }
    return arr;
  };
  /*
  * 获取当天时间
  * */
  let getCurrentDate = function () {
    let currentDate = new Date();
    return  {
      year:currentDate.getFullYear(),
      month:currentDate.getMonth()+1,
      date : currentDate.getDate()
    }
  };

  /*
  *  通过node-rsa生成公钥和密钥
  */
  const getRSAKey = ()=>{
    const key = new NodeRSA({b: 2048});  //2048 密钥长度
    key.setOptions({ encryptionScheme: 'pkcs1' });//指定加密格式  不改格式得话可能会报错
    return {
      key: key,
      publicKey: key.exportKey("pkcs8-public-pem"), //公钥
      privateKey: key.exportKey('pkcs8-private-pem') //私钥
    }    
  }
module.exports={
  createOnlyID:createOnlyID,
  getCurrentDate:getCurrentDate,
  sortArr:sortArr,
  getRSAKey: getRSAKey
};
