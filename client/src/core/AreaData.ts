import provinces from '../assets/json/provinces.json';
import cities from '../assets/json/cities.json';
import areas from '../assets/json/areas.json'

type Province = {
  name: string,
  code: string
};

type City = {
  name: string,
  code: string,
  provinceCode: string
};
type Area = {
  name: string,
  code: string,
  provinceCode: string,
  cityCode: string
};

const formatAreas =(city: City)=>{
  return areas.filter((ele:Area)=>{
    return ele.cityCode === city.code;
  }).map((ele:Area)=>{
    return {
      label: ele.name,
      value: ele.name,
      code: ele.code
    }
  })
}

const formatCities =(province: Province)=>{
  return cities.filter((ele:City)=>{
    return ele.provinceCode === province.code;
  }).map((ele:City)=>{
    return {
      label: ele.name,
      value: ele.name,
      code: ele.code,
      children: formatAreas(ele)
    }
  });
}

const formatProvinces = ()=>{
  return provinces.map(ele=>{
    return {
      label: ele.name,
      value: ele.name,
      code: ele.code,
      children: formatCities(ele)
    }
  });
}


export const AreaData = formatProvinces();