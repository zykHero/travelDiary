import { useState } from 'react';
import './App.less';
import {Menus} from './component/menus/menus';
import {Outlet} from 'react-router-dom';
function App() {
  return (
    <>
      <div className="app">
        <div className='content'>
          <Outlet />
        </div>
        <Menus/>
      </div>
    </>
    
  );
}

export default App;
