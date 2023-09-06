import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import './index.less';
import { router } from './core/Router';
// window.onload = ()=>{
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  const SpinnerOfDoom = () =>{
    return <>
      加载中...
    </>
  }
  
  root.render(
    <React.StrictMode>
      <RouterProvider router={router}  fallbackElement={<SpinnerOfDoom />}/>
    </React.StrictMode>
  );
  
// }
