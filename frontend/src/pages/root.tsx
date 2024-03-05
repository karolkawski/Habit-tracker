// import 'react-calendar/dist/Calendar.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

import { Outlet } from 'react-router-dom';

export const Root = () => {
  return (
    <div className="App">
      <Outlet />
    </div>
  );
};
