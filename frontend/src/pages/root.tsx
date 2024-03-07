import axios from 'axios';
import { Outlet } from 'react-router-dom';
import { getTokenFromLocalStorage } from '../utils/token';
import { useEffect } from 'react';
import { fetchSettingsSuccess } from '../store/actions/settingsActions';
import { useDispatch } from 'react-redux';

const config = {
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
};

export const Root = () => {
  const dispatch = useDispatch();
  const fetchSettings = () => {
    axios
      .get('http://localhost:4000/api/settings', config)
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
