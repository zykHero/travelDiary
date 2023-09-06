import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, NavBar } from 'antd-mobile'

import { Editor } from '@tinymce/tinymce-react';
import {
  Route,
  useNavigate,
  useLocation,
  MemoryRouter as Router,
} from 'react-router-dom';

let editDiaryContent = '';

const handleEditorChange = (content: any, editor: any) => {
  editDiaryContent = content;
  console.log('Content was updated:', content);

}

const save = ()=> {
  console.log(editDiaryContent)
}

const createEditor = ()=>{
  
  
}

const  EditDiary: FC =  ()=> {
  const editorRef: any = useRef(null);
  const navigate = useNavigate();
  const [isShowEditDiary, setEditDiaryDisplay] = useState(true);//根据接口查询后的结果来定
  const [title, setTitle] = useState('');//根据接口查询后的结果来定
  const location = useLocation();
  const id = location.state.id;
  console.log("id",id)
  const gotoDiary = ()=>{
    navigate('/diary');
  }
  useEffect(() => {
    if (id !== '') {
        //todo 通过日记id 查询 日记内容
        // 先置灰
    }
    return ()=>{
      console.log('组件卸载时的生命函数')
    }
  });
  return isShowEditDiary ? <>
    <NavBar onBack={gotoDiary}>{title}</NavBar>
    <div style={{
      position: 'fixed',
      zIndex: '999',
      right: '16px',
      top: '2px',
    }}>
     <Button  color='primary' style={{marginRight: '8px'}} fill='solid' onClick={()=>{save()}}>保存</Button>
   </div>
    <Editor
      onInit={(evt, editor) => editorRef.current = editor}
      init={{
        height: 'calc(100% - 45px)',
        menubar: false,
        language: 'zh_CN',
        branding: false,//隐藏右下角技术支持图标
        mobile: {
         menubar: false
        },
        toolbar: 'undo redo | formatselect | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        setup: (editor) => { // 自定义工具栏按钮
         editor.ui.registry.addButton('codesampleplus', {
             text: 'Insert/Edit code sample',
             // title: "Insert/Edit code sample",
             tooltip: 'Insert/Edit code sample',
             onAction: (_) => editor.execCommand('CodeSample') // 执行命令
         });
         }
      }}
     onEditorChange={handleEditorChange}
    />
  </>: null      
}

export {EditDiary}