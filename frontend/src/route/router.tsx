import { createBrowserRouter } from 'react-router-dom';
import { Habit } from '../pages/habit';
import { Root } from '../pages/root';
import { Habits } from '../pages/habits';
import { Statistics } from '../pages/statistics';
import { Settings } from '../pages/settings';
import { Login } from '../pages/login';
import { Dashboard } from '../pages/dashboard';
import { HabitForm } from '../Forms/HabitForm';
import { Registry } from '../pages/registry';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Login />,
      },
      {
        path: '/registry',
        element: <Registry />,
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/habits',
        element: (
          <ProtectedRoute>
            <Habits />
          </ProtectedRoute>
        ),
      },
      {
        path: '/statistics',
        element: (
          <ProtectedRoute>
            <Statistics />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: '/habits/:id',
        element: (
          <ProtectedRoute>
            <Habit />
          </ProtectedRoute>
        ),
      },
      {
        path: '/habits/:id/edit',
        element: (
          <ProtectedRoute>
            <HabitForm isAdd={false} />
          </ProtectedRoute>
        ),
      },
      {
        path: 'add',
        element: (
          <ProtectedRoute>
            <HabitForm isAdd={true} />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
