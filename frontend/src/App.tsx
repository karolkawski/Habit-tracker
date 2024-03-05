// import './index.scss';
// import axios from 'axios';
// import HabitContext from './store/context';
// import SettingsContext from './store/settings';
// import { useContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Habit } from './pages/habit';
// import { SettingsProvider } from './Providers/SettingsProvider';
import { Add } from './pages/add';
// import { Dashboard } from './pages/dashboard';
import { Edit } from './pages/edit';
import { Root } from './pages/root';
// import { HabitType } from './types/Habit.d';
import { Habits } from './pages/habits';
// import { Header } from './Layout/Header/Header';
import { Statistics } from './pages/statistics';
import { Settings } from './pages/settings';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { Provider } from 'react-redux';
import store from './store/store';

function App() {
  // const [loading, setLoading] = useState(true);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/',
          element: <Login />,
        },
        {
          path: '/dashboard',
          element: <Dashboard />,
        },
        {
          path: '/habits',
          element: <Habits />,
        },
        {
          path: '/statistics',
          element: <Statistics />,
        },
        {
          path: '/settings',
          element: <Settings />,
        },
        {
          path: '/habits/:id',
          element: <Habit />,
        },
        {
          path: '/habits/:id/edit',
          element: <Edit />,
        },
        {
          path: 'add',
          element: <Add />,
        },
      ],
    },
  ]);
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
        {/* <ParticlesAnimate /> */}
      </Provider>
    </>
  );
}

export default App;
