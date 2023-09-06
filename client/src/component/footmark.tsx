import React, { FC } from 'react'
import { Tabs , Button } from 'antd-mobile'
import {
  Route,
  useNavigate,
  useLocation,
  MemoryRouter as Router,
} from 'react-router-dom';
import { FootMarkMap } from './footMarkMap';

const Footmark: FC =()=> {
  const navigate =useNavigate();
  const addFootmark = ()=>{
    navigate('/add-footmark');
  }
  return (
    <div>
        <Button color='primary' fill='solid' onClick={()=>{addFootmark()}}>添加足迹</Button>
        <FootMarkMap />
    </div>
  );
}

export {Footmark}