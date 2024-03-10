import axios from 'axios';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchSettingsSuccess } from '../store/actions/settingsActions';
import { useDispatch } from 'react-redux';
import { AuthHeader } from '../auth/AuthHeader';

export const Root = () => {
  const dispatch = useDispatch();
  const fetchSettings = () => {
    axios
      .get('http://localhost:4000/api/settings', AuthHeader)
      .then((res) => {
        dispatch(fetchSettingsSuccess(res.data));
      })
      .catch((e) => {
        console.error(e);
      });
  };
  useEffect(() => {
    fetchSettings();
  }, []);
  return (
    <div className="App">
      <Outlet />
    </div>
  );
};
