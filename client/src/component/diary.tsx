import React, { FC, useRef } from 'react'
import { Button, List } from 'antd-mobile'
import {
  Route,
  useNavigate,
  useLocation,
  MemoryRouter as Router,
} from 'react-router-dom';



const Diary: FC = () => {
  const diaryList = [{
    id: '1',
    time: '2023-8-15',
    title: '成都熊猫基地游记'
  }];
  const navigate = useNavigate();
  const gotoWriteDiary = (id: string) => {
    //todo 路由带参传递
    navigate('/edit-diary', { state: { id: id } });
  }
  return (
    <>
      {/* 写日记 */}
      <Button color='primary' fill='solid' onClick={() => { gotoWriteDiary('') }}>写日记</Button>
      {/* 日记列表 */}
      <List style={{
        margin: '16px'
      }}>
        {diaryList.map(user => (
          <List.Item key={user.id} onClick={() => { gotoWriteDiary(user.id) }}>{user.title}</List.Item>
        ))}
      </List>
    </>
  );

}

export { Diary }