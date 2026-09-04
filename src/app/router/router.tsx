import { createBrowserRouter } from 'react-router';
import App from '../App';
import { HomePage } from '@/features/home/pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      }
    ]
  },
]);
