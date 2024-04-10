import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchSettingsSuccess } from '../store/actions/settingsActions';
import { AuthHeader } from '../auth/AuthHeader';
import { fetchUserSuccess } from '../store/actions/userActions';

export const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: { user }) => state.user.token);

  const fetchSettings = () => {
    axios
      .get('http://localhost:5001/api/settings', AuthHeader(token))
      .then((res) => {
        dispatch(fetchSettingsSuccess(res.data));
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getUserData = () => {
    try {
      axios
        .get('http://localhost:5001/api/user/me', AuthHeader(token))
        .then((response) => {
          dispatch(fetchUserSuccess(response.data));
        })
        .catch((e) => {
          console.error('Something went wrong during signing in: ', e);
        });
    } catch (err) {
      console.error('Some error occured during signing in: ', err);
    }
  };

  if (!token) {
    return <Navigate to="/" replace />;
  }

  getUserData();
  fetchSettings();

  return children;
};
