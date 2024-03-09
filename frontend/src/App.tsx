import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Habit } from './pages/habit';
import { Root } from './pages/root';
import { Habits } from './pages/habits';
import { Statistics } from './pages/statistics';
import { Settings } from './pages/settings';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { Provider } from 'react-redux';
import store from './store/store';
import { HabitForm } from './Forms/HabitForm';

function App() {
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
          element: <HabitForm isAdd={false} />,
        },
        {
          path: 'add',
          element: <HabitForm isAdd={true} />,
        },
      ],
    },
  ]);
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
