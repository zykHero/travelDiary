import { useEffect } from 'react';
// csdn：通过工具（http://datav.aliyun.com/portal/school/atlas/area_selector）获取 china的GeoJSON数据

import chinaMap from '../assets/json/chinaPly.json'
// 5+以上版本没有china.json
const echarts = require("echarts");

const options = {
  // tooltip: {
  //   trigger: "item",
  //   show: true,
    // formatter: (params: any) => {
    //   console.log(params)
    //   return 'zyk';
    // }
  // },
  // geo: {
  //   map: 'china', //使用 registerMap 注册的地图名称。
  //   type: 'map',
  //   itemStyle: {
  //     normal: {
  //       areaColor: 'rgba(27, 73, 135, 0.3)',
  //       borderColor: 'rgba(58, 128, 177, 0.4)',
  //     },
  //   },
  //   zoom: 1,          // 地图放大
  //   aspectScale: 0.8, //地图宽高比例
  //   roam: true,        //地图缩放、平移
  //   label: {
  //     normal: {
  //       show: false,
  //       textStyle: {
  //         color: "rgba(246, 91, 39, 0.5)",
  //       },
  //     }
  //   },
  //   // 滚轮缩放的极限控制
  //   scaleLimit: {
  //     min: 0.5, //缩放最小大小
  //     max: 6, //缩放最大大小
  //   },
  //   emphasis: {
  //     disabled: true, //关闭高亮
  //   },
  //   layoutCenter: ['50%', '50%'],
  //   // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
  //   // layoutSize: '80%' //支持相对于屏幕宽高的百分比或者绝对的像素大小。
  //   tooltip: {
  //     trigger: "item",
  //     show: true,
  //     formatter: (params: any) => {
  //       return params.name;
  //     }
  //   }
  // },
  tooltip: {
    trigger: "item",
    show: true,
    formatter: (params: any) => {
      // console.log(params)
      return params.name;
    }
  },
  series:[{
    type: 'map',
    map: 'china',
    roam: true, //缩放，开启缩放或者平移，可以设置成 'scale' 或者 'move'， true都开启
    zoom: 1,          // 地图放大
    aspectScale: 0.8, //地图宽高比例
    nameProperty: 'name', //关联关键数据geojson数据中的关键key 
    emphasis: {
      disabled: false, //关闭高亮,
      itemStyle: {
        areaColor: 'rgba(27, 73, 135, 0.3)',
        borderColor: 'black',
        borderWidth: 2
      }
    },
    itemStyle: {
      normal: {
        areaColor: 'rgba(27, 73, 135, 0.3)',
        borderColor: 'rgba(58, 128, 177, 0.4)'
      },
    },
    select: {
      disabled: false,
      itemStyle: {
        areaColor: 'rgba(27, 73, 135, 0.3)',
        borderColor: 'black',
        borderWidth: 2
      }
    },
    tooltip: {
      trigger: "item",
      show: true,
      formatter: (params: any) => {
        console.log(params)
        return params.name;
      }
    },
    //todo 根据添加的地点，确定data里的数据，精确到市
    data: [{
      name: '乌鲁木齐市',
      value: 66,
      //自定义特殊 tooltip，仅对该数据项有效
      tooltip:{
        formatter:(val:any)=>{
          debugger
          console.log(val)
          return '666'
        }
      },
      itemStyle: {
        areaColor: 'yellow',
        color: 'yellow'
      }
    }]
  }]
}


const createMap = () => {
  const MyChart = echarts.init(document.getElementById("map-container"));
  echarts.registerMap("china", chinaMap);
  MyChart.setOption(options);
}

const FootMarkMap = () => {
  useEffect(() => {
    createMap();
    return ()=>{
      console.log('组件卸载时的生命函数')
    }
  });
  return (
    <div id='map-container' style={{ 'height': '85vh' }}></div>
  );
}


export { FootMarkMap }