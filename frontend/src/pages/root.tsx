import { Outlet } from 'react-router-dom';

export const Root = () => {
  return (
    <div className="App">
      <Outlet />
    </div>
  );
};
