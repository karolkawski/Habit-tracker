import axios from 'axios';
import { Dropdown, Navbar } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthHeader } from '../../auth/AuthHeader';
import { useDispatch, useSelector } from 'react-redux';
import { removeTokenSuccess } from '../../store/actions/userActions';

export const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state: { user }) => state.user.token);
  const user = useSelector((state: { user }) => {
    return state.user.user;
  });
  const logOut = () => {
    try {
      axios
        .post('http://localhost:5001/api/user/logout', {}, AuthHeader(token))
        .then(() => {
          dispatch(removeTokenSuccess());
          navigate('/');
        })
        .catch((e) => {
          console.error('Something went wrong during logging out ', e);
        });
    } catch (err) {
      console.error('Some error occured during logging out: ', err);
    }
  };

  return (
    <Navbar>
      <Navbar.Brand as={Link} href="https://flowbite-react.com">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Habits tracker
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link as={Link} to="/dashboard">
          Dashboard
        </Navbar.Link>{' '}
        <Navbar.Link as={Link} to="/habits">
          Habits
        </Navbar.Link>{' '}
        <Navbar.Link as={Link} to="/statistics">
          Statistics
        </Navbar.Link>
        {user ? (
          <li className="">
            <Dropdown
              arrowIcon={true}
              inline
              label={<div className="pl-3">Profile</div>}
            >
              <Dropdown.Header>
                <span className="block text-sm">{user.name}</span>
                <span className="block truncate text-sm font-medium">
                  {user.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Item>
                <Navbar.Link as={Link} to="/settings">
                  Settings
                </Navbar.Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logOut}>Sign out</Dropdown.Item>
            </Dropdown>
          </li>
        ) : (
          <></>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};
