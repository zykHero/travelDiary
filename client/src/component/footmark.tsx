import { FC, useState } from 'react'
import { Button } from 'antd-mobile'
import {
  Route,
  useNavigate,
  useLocation,
  MemoryRouter as Router,
} from 'react-router-dom';
import { FootMarkMap } from './footMarkMap';

const Footmark: FC =()=> {
  const [isShowUserList, setShowUserList] = useState(false);
  const [isShowUserListButton, setShowUserListButton] = useState(false);

  const navigate =useNavigate();
  const addFootmark = ()=>{
    navigate('/add-footmark');
  }
  const changeUserListButtonDisplay = (isShow: boolean) =>{
    setShowUserListButton(isShow);
  }
  return (
    <div>
      <div style={{paddingTop: '16px'}}>
        <Button color='primary' fill='solid' onClick={()=>{addFootmark()}}>添加足迹</Button>
        {isShowUserListButton ? <Button fill='solid' style={{marginLeft: '16px'}} onClick={()=>{setShowUserList(!isShowUserList)}}>{isShowUserList ? '收起用户列表' : '展开用户列表'}</Button>
        : null}
        <FootMarkMap isShowUserList={isShowUserList} changeUserListButtonDisplay={changeUserListButtonDisplay} />
      </div>
    </div>
    
  );
}

export {Footmark}