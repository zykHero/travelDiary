import { FC, RefObject, useState } from 'react'
import { NavBar, Space, Form, Input, DatePicker, Button, Cascader, TextArea } from 'antd-mobile'
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker'
import { AreaData } from '../core/AreaData';
import { HttpAPI, AddFootMarkReqParams } from './api/http-api';


interface AddressFieldProps {
  value: string[]
  onChange?: (value: string[]) => void
}

const SelectAddress = ({ value, onChange }: AddressFieldProps) => {
  const [visible, setVisible] = useState(false);
  const options = AreaData;
  return (
    <Space align='center'>
      <Button
        onClick={() => {
          setVisible(true)
        }}
      >
        选择位置
      </Button>
      <Cascader options={options} visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        onSelect={(val: string[], extend) => {
          onChange?.(val)
        }}
      >
        {items => {
          if (items.every(item => item === null)) {
            return '未选择'
          } else {
            return items.map(item => item?.label ?? '未选择').join('-')
          }
        }}
      </Cascader>
    </Space>
  )
}

const AddFootmark: FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const BackPage = () => {
    navigate('/footmark');
  };
  const onFinish = (values: AddFootMarkReqParams) => {
    new HttpAPI().addFootMarkHttp(values).then(res=>{
      console.log('成功了',res);
      BackPage();
    }).catch(error=>{
      console.log(error)
    })
  }

  return (
    <>
      <NavBar back='返回' onBack={BackPage}>添加足迹</NavBar>
      <Form name='form' form={form} onFinish={onFinish}
        footer={
          <Button block type='submit' color='primary' size='large'>提交</Button>
        }
      >
        <Form.Item name='time' label='时间' trigger='onConfirm' rules={[{ required: true }]}
          onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
            datePickerRef.current?.open()
          }}
        >
          <DatePicker>
            {value => value ? dayjs(value).format('YYYY-MM-DD') : '请选择日期'}
          </DatePicker>
        </Form.Item>
        <Form.Item name='address' label='城市' rules={[{ required: true }]}>
          <SelectAddress value={['']} />
        </Form.Item>
        <Form.Item name='notes' label='备注'>
          <TextArea showCount placeholder='留下些故事吧~' maxLength={250} />
        </Form.Item>
      </Form>
    </>

  );
}

export { AddFootmark }