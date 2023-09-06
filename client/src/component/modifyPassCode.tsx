import { FC, useState } from 'react'
import { Form, Button, Input, NavBar } from 'antd-mobile'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import  './modify-paas-code.less';
import {
  Route,
  useNavigate,
  useLocation,
  MemoryRouter as Router,
} from 'react-router-dom';

const ModifyPassCode: FC = () => {
  const [oldPwdVisible, setOldPwdVisible] = useState(false);
  const [newPwdVisible, setNewPwdVisible] = useState(false);
  const [newRepeatPwdVisible, setNewRepeatPwdVisible] = useState(false);

  const navigate = useNavigate();
  const backPage = () => {
    navigate('/me');
  };
  return (
    <>
      <NavBar back='返回' onBack={backPage}>修改密码</NavBar>

      <Form layout='horizontal'
        footer={
          <Button block type='submit' color='primary' size='large'>提交</Button>
        }
      >
        <Form.Item name='oldPwd' label='旧密码' rules={[{ required: true, message: '旧密码不能为空' }]}>
          <div className='pwd-item'>
            <Input type={oldPwdVisible ? 'text' : 'password'}/>
            <div className='eye'>
              {!oldPwdVisible ? (
                <EyeInvisibleOutline onClick={() => setOldPwdVisible(true)} />
              ) : (
                <EyeOutline onClick={() => setOldPwdVisible(false)} />
              )}
            </div>
          </div>
        </Form.Item>
        
        <Form.Item name='newPwd' label='新密码' rules={[{ required: true, message: '新密码不能为空' }]}>
          <div className='pwd-item'>
            <Input type={newPwdVisible ? 'text' : 'password'} onChange={(value)=>{
              
            }} />
            <div className='eye'>
              {!newPwdVisible ? (
                <EyeInvisibleOutline onClick={() => setNewPwdVisible(true)} />
              ) : (
                <EyeOutline onClick={() => setNewPwdVisible(false)} />
              )}
            </div>
          </div>
        </Form.Item>

        {/* <Form.Item name='newPwd' label='确认密码' rules={[{ required: true, message: '确认密码不能为空' }]}>
          <div className='pwd-item'>
            <Input type={newRepeatPwdVisible ? 'text' : 'password'}/>
            <div className='eye'>
              {!newRepeatPwdVisible ? (
                <EyeInvisibleOutline onClick={() => setNewRepeatPwdVisible(true)} />
              ) : (
                <EyeOutline onClick={() => setNewRepeatPwdVisible(false)} />
              )}
            </div>
          </div>
        </Form.Item> */}
      </Form>




      {/* <Button block color='primary' size='large' onClick={()=>{}}>确定</Button>
          <Button block size='large' onClick={()=>{ backPage() }}>取消</Button> */}
    </>
  );
}

export { ModifyPassCode }