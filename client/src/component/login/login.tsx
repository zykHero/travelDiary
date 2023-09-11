import { FC, useState } from 'react'
import { Form, Input, Button } from 'antd-mobile'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom';
import { HttpAPI, LoginReqParams } from '../api/http-api';
import { RSA } from '../../core/util';
import './login.less';


const Login: FC = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  let username = '';
  let pwd = '';
  const goToSystem = () => {
    navigate('/footmark');
  };
  const onLogin = async (username: string, pwd: string) => {
    //由于encryption返回的时一个promise，所以需要await
    const encryptionPwd = await new RSA().encryption(pwd) || '';
    let values: LoginReqParams = {
      username: username,//todo 与输入框绑定
      password: encryptionPwd as any
    };
    new HttpAPI().login(values).then(res=>{
      console.log('登录成功了',res);
      goToSystem();
    }).catch(error=>{
      console.log(error)
    })
  }

  return (
    <>
      <div className='login-title'>旅行日记</div>
      <div className='login-form'>
          <Form layout='horizontal' >
          <Form.Item label='用户名' name='username'>
            <Input placeholder='请输入用户名' autoComplete='false' onChange={(value)=>{
              console.log(value)
              username = value;
            }} clearable />
          </Form.Item>
          <Form.Item
            label='密码'
            name='password'
            extra={
              <div className="eye">
                {!visible ? (
                  <EyeInvisibleOutline onClick={() => setVisible(true)} />
                ) : (
                  <EyeOutline onClick={() => setVisible(false)} />
                )}
              </div>
            }
          >
            <Input
              placeholder='请输入密码'
              onChange={(value)=>{
                pwd = value;
              }}
              clearable
              type={visible ? 'text' : 'password'}
            />
          </Form.Item>
        </Form>

        <Button block color='primary' size='large' onClick={()=>{onLogin(username,pwd)}}>登录</Button>
      </div>
       
    </>

  );
}

export { Login }