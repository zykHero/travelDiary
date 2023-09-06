import React, { FC } from 'react'
import { List, Button,Avatar,Space } from 'antd-mobile'
import { SetOutline } from 'antd-mobile-icons'
import {
  Route,
  useNavigate,
  useLocation,
  MemoryRouter as Router,
} from 'react-router-dom';

const getUserInfo = ()=>{
  //todo  通过接口获取头像图片
  return {image: 'xxxx', name: 'zyk'};
}





const Me: FC =()=> {
    const {image, name}  = getUserInfo();
    const navigate = useNavigate();
    const logout = ()=>{
      // alert('退出系统');
      //todo  下发接口
      navigate('/login');
      
    }
    
    return (
        // 头像 + 名称+描述
        <>
          <List>
            <List.Item prefix={<Avatar src={image} alt=""/>} onClick={()=> {}}>{name}</List.Item>
            <List.Item prefix={<SetOutline />} onClick={() => { navigate('/config') }}>修改密码</List.Item>
          </List>
          <Button block color='primary' size='large' onClick={()=>{logout()}}>退出</Button>
        </>
    );
}

export {Me}