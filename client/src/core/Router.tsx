import { createHashRouter } from "react-router-dom";
import App from "../App";
import { Diary } from "../component/diary";
import { Footmark } from "../component/footmark";
import { Me } from "../component/me";
import {AddFootmark} from "../component/addFootmark";
import { ModifyPassCode } from '../component/modifyPassCode';
import { EditDiary } from '../component/edit-diary';
import { Login } from '../component/login/login';
 
const router = createHashRouter([
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: "",
          element: <Login />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "footmark",
          element: <Footmark />,
        },
        {
          path: "add-footmark",
          element: <AddFootmark />,
        },
        {
            path: "diary",
            element: <Diary />
        }, {
            path: 'edit-diary',
            element: <EditDiary />
        }, {
            path: "me",
            element: <Me />
        }, {
          path: 'config',
          element: <ModifyPassCode />
        }
      ]
    }
  ]);

  export { router }